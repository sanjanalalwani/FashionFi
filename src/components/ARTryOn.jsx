import React, { useState, useEffect, useRef } from 'react';

const ARTryOn = ({ products, onClose }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productImages, setProductImages] = useState({});

  useEffect(() => {
    let stream = null;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'user',
            width: { ideal: 640 },
            height: { ideal: 480 },
          },
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          setIsStreaming(true);
          setError(null);
        }
      } catch (err) {
        setError(
          'Failed to access camera. Please ensure camera permissions are granted.'
        );
        console.error('Camera access error:', err);
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    // Preload product images and store base64 data
    products.forEach((product) => {
      fetch(product.image)
        .then((res) => res.blob())
        .then((blob) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            setProductImages((prev) => ({
              ...prev,
              [product.id]: reader.result.split(',')[1],
            }));
          };
          reader.readAsDataURL(blob);
        })
        .catch((err) => {
          console.error('Error loading product image:', err);
        });
    });
  }, [products]);

  useEffect(() => {
    if (
      !isStreaming ||
      !videoRef.current ||
      !canvasRef.current ||
      !selectedProduct ||
      !productImages[selectedProduct.id]
    )
      return;

    let animationFrame;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const processFrame = async () => {
      // Set canvas size to match video
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;

      // Draw the current video frame
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

      try {
        // Convert canvas to base64
        const base64Frame = canvas.toDataURL('image/jpeg').split(',')[1];

        // Send frame and selected product image to processing server
        const response = await fetch('http://localhost:5000/process_frame', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            frame: base64Frame,
            productImage: productImages[selectedProduct.id],
          }),
        });

        if (response.ok) {
          const { frame } = await response.json();
          // Draw the processed frame with overlay
          const img = new Image();
          img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          };
          img.src = `data:image/jpeg;base64,${frame}`;
        }
      } catch (err) {
        console.error('Frame processing error:', err);
      }

      animationFrame = requestAnimationFrame(processFrame);
    };

    processFrame();

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isStreaming, selectedProduct, productImages]);

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-4 max-w-4xl w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Virtual Try-On</h2>
          <button
            className="p-2 hover:bg-gray-100 rounded-full"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {error ? (
          <div className="text-red-500 p-4 text-center">{error}</div>
        ) : (
          <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
          {/* Remove the mirroring since we're handling it on the server */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover"
          />
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
        )}

        <div className="mt-4">
          <h3 className="font-medium mb-2">Select a Product to Try On:</h3>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {products.map((product) => (
              <div
                key={product.id}
                className={`relative cursor-pointer ${
                  selectedProduct?.id === product.id
                    ? 'ring-2 ring-blue-500'
                    : ''
                }`}
                onClick={() => setSelectedProduct(product)}
              >
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                {selectedProduct?.id === product.id && (
                  <div className="absolute inset-0 bg-blue-500 bg-opacity-20 rounded-lg" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ARTryOn;
