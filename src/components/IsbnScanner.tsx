"use client";

import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import BookConfirmation from "@/components/BookConfirmation";
import { cleanIsbn, isValidIsbn, isValidIsbn13 } from "@/lib/isbn";

type ScanStatus = "idle" | "starting" | "scanning" | "success" | "error";

type ScannerControls = {
  stop: () => void | Promise<void>;
};

function stopVideo(video: HTMLVideoElement | null) {
  const stream = video?.srcObject;
  if (stream instanceof MediaStream) {
    stream.getTracks().forEach((track) => track.stop());
  }
  if (video) video.srcObject = null;
}

export default function IsbnScanner() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsRef = useRef<ScannerControls | null>(null);
  const [status, setStatus] = useState<ScanStatus>("idle");
  const [isbn, setIsbn] = useState("");
  const [manualIsbn, setManualIsbn] = useState("");
  const [message, setMessage] = useState(
    "Point your camera at the ISBN barcode on the back of a book.",
  );

  const stopScanner = useCallback(() => {
    const controls = controlsRef.current;
    controlsRef.current = null;
    if (controls) void controls.stop();
    stopVideo(videoRef.current);
  }, []);

  useEffect(() => stopScanner, [stopScanner]);

  const acceptIsbn = useCallback(
    (value: string) => {
      const normalized = cleanIsbn(value);

      if (!isValidIsbn(normalized)) {
        setStatus("error");
        setMessage("That code does not look like a valid ISBN. Try again.");
        return false;
      }

      stopScanner();
      setIsbn(normalized);
      setStatus("success");
      setMessage("ISBN captured.");
      return true;
    },
    [stopScanner],
  );

  async function startScanner() {
    stopScanner();
    setIsbn("");
    setStatus("starting");
    setMessage("Starting camera…");

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("Camera access is not supported by this browser.");
      }

      const [{ BrowserMultiFormatReader }, zxing] = await Promise.all([
        import("@zxing/browser"),
        import("@zxing/library"),
      ]);

      const hints = new Map();
      hints.set(zxing.DecodeHintType.POSSIBLE_FORMATS, [
        zxing.BarcodeFormat.EAN_13,
      ]);

      const reader = new BrowserMultiFormatReader(hints, {
        delayBetweenScanAttempts: 150,
        delayBetweenScanSuccess: 750,
      });

      const video = videoRef.current;
      if (!video) throw new Error("Scanner preview is unavailable.");

      const controls = await reader.decodeFromConstraints(
        {
          audio: false,
          video: {
            facingMode: { ideal: "environment" },
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
        },
        video,
        (result, _error, callbackControls) => {
          if (!result) return;

          const value = cleanIsbn(result.getText());
          if (value.length !== 13 || !isValidIsbn13(value)) {
            setMessage(
              "Barcode found, but it is not a valid book ISBN-13. Keep scanning.",
            );
            return;
          }

          controlsRef.current = callbackControls;
          acceptIsbn(value);
        },
      );

      controlsRef.current = controls;
      setStatus("scanning");
      setMessage("Scanning for an ISBN-13 barcode…");
    } catch (error) {
      stopScanner();
      setStatus("error");

      if (error instanceof DOMException && error.name === "NotAllowedError") {
        setMessage(
          "Camera permission was denied. Allow camera access or enter the ISBN manually.",
        );
        return;
      }

      setMessage(
        error instanceof Error
          ? error.message
          : "Could not start the camera. Enter the ISBN manually.",
      );
    }
  }

  function handleManualSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    acceptIsbn(manualIsbn);
  }

  function handleStop() {
    stopScanner();
    setStatus("idle");
    setMessage("Camera stopped. Tap Scan Book when you are ready.");
  }

  function reset() {
    stopScanner();
    setIsbn("");
    setManualIsbn("");
    setStatus("idle");
    setMessage("Point your camera at the ISBN barcode on the back of a book.");
  }

  const cameraActive = status === "starting" || status === "scanning";

  if (status === "success" && isbn) {
    return <BookConfirmation isbn={isbn} onScanAgain={reset} />;
  }

  return (
    <main className="app-shell">
      <section className="brand-block" aria-labelledby="page-title">
        <p className="eyebrow">THRIFT BOOK SCANNER</p>
        <h1 id="page-title">Look4Book</h1>
        <p className="brand-copy">
          Scan the book. Check the numbers. Decide whether it is worth buying.
        </p>
      </section>

      <section className="scanner-card" aria-live="polite">
        <div className="section-heading">
          <div>
            <span className="step-chip">STEP 1</span>
            <h2>Scan ISBN</h2>
          </div>
          <span
            className={`status-dot status-${status}`}
            aria-label={`Scanner status: ${status}`}
          />
        </div>

        <div className={`camera-frame ${cameraActive ? "camera-active" : ""}`}>
          <video
            ref={videoRef}
            className="camera-video"
            muted
            playsInline
            aria-label="Barcode scanner camera preview"
          />

          {!cameraActive && status !== "success" && (
            <div className="camera-placeholder">
              <div className="barcode-mark" aria-hidden="true">
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>
              <strong>ISBN barcode</strong>
              <small>Usually on the back cover</small>
            </div>
          )}


          {cameraActive && <div className="scan-guide" aria-hidden="true" />}
        </div>

        <p className={`scanner-message ${status === "error" ? "error-text" : ""}`}>
          {message}
        </p>

        <button
          className="button button-primary"
          type="button"
          onClick={cameraActive ? handleStop : startScanner}
          disabled={status === "starting"}
        >
          {status === "starting"
            ? "STARTING CAMERA…"
            : cameraActive
              ? "STOP CAMERA"
              : "SCAN BOOK"}
        </button>
      </section>

      <section className="manual-card">
          <div className="divider-label">
            <span>OR ENTER IT MANUALLY</span>
          </div>

          <form onSubmit={handleManualSubmit}>
            <label htmlFor="manual-isbn">ISBN-10 or ISBN-13</label>
            <div className="manual-row">
              <input
                id="manual-isbn"
                name="isbn"
                inputMode="text"
                autoComplete="off"
                placeholder="9780134685991"
                value={manualIsbn}
                onChange={(event) => setManualIsbn(event.target.value)}
              />
              <button
                className="button button-secondary"
                type="submit"
                disabled={!manualIsbn.trim()}
              >
                USE ISBN
              </button>
            </div>
          </form>
        </section>

      <p className="privacy-note">
        Camera video stays on your device during scanning.
      </p>
    </main>
  );
}
