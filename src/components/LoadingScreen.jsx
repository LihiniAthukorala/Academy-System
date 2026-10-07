import React from 'react';

const LoadingScreen = () => (
    <main
        className="academy-loading-screen"
        role="status"
        aria-live="polite"
        aria-label="Loading Ratnapura Chess Academy"
    >
        <div className="academy-loader-glow academy-loader-glow-left" />
        <div className="academy-loader-glow academy-loader-glow-right" />

        <section className="academy-loader-content">
            <div className="academy-loader-mark">
                <span className="academy-loader-ring academy-loader-ring-outer" />
                <span className="academy-loader-ring academy-loader-ring-inner" />
                <img src="/ratnapura-logo.jpeg" alt="" />
            </div>
            <p className="academy-loader-eyebrow">Ratnapura Chess Academy</p>
            <h1>Preparing your workspace</h1>
            <p className="academy-loader-caption">Setting up your next move...</p>
            <div className="academy-loader-track" aria-hidden="true">
                <span />
            </div>
            <span className="sr-only">Loading academy data</span>
        </section>
    </main>
);

export default LoadingScreen;
