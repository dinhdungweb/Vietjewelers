import { useState, useEffect } from 'react';

export default function AgeVerification() {
  const [show, setShow] = useState(false);
  const [rejected, setRejected] = useState(false);

  useEffect(() => {
    const verified = localStorage.getItem('age-verified');
    if (!verified) {
      setShow(true);
    }
  }, []);

  const handleYes = () => {
    localStorage.setItem('age-verified', 'true');
    setShow(false);
  };

  const handleNo = () => {
    setRejected(true);
  };

  const handleRetry = () => {
    setRejected(false);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-8 md:p-12 max-w-md w-full text-center">
        {!rejected ? (
          <>
            <h2 className="text-2xl font-medium mb-3">Confirm your age</h2>
            <p className="text-foreground-secondary text-sm mb-8">
              Are you 18 years old or older?
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={handleNo}
                className="px-8 py-3 border border-border text-sm font-medium uppercase tracking-wider rounded hover:bg-background-secondary transition-colors"
              >
                No, I'm not
              </button>
              <button
                onClick={handleYes}
                className="px-8 py-3 bg-button text-button-text text-sm font-medium uppercase tracking-wider rounded hover:bg-foreground transition-colors"
              >
                Yes, I am
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-medium mb-3">Come back when you're older</h2>
            <p className="text-foreground-secondary text-sm mb-8">
              Sorry, the content of this store can't be seen by a younger audience. Come back when you're older.
            </p>
            <button
              onClick={handleRetry}
              className="px-8 py-3 border border-border text-sm font-medium uppercase tracking-wider rounded hover:bg-background-secondary transition-colors"
            >
              Oops, I entered incorrectly
            </button>
          </>
        )}
      </div>
    </div>
  );
}
