import React from "react";
import { Upload, Sparkles, Download } from "lucide-react";
import UploadImage from "./components/UploadImage";
import styles from "./page.module.css";

function App() {
  return (
    <div className={styles.app}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerTitle}>
            <Sparkles className={styles.headerIcon} />
            <h1>AI Image Renamer</h1>
          </div>
          <p className={styles.headerDescription}>
            Upload any image and let AI analyze it to generate a more descriptive and accurate filename
          </p>
        </div>

        <div className={styles.mainContent}>
          <UploadImage />

          {/* Features Section */}
          <div className={`${styles.card} ${styles.featuresSection}`}>
            <h2 className={styles.featuresTitle}>How It Works</h2>
            <div className={styles.featuresGrid}>
              <div className={styles.featureItem}>
                <div className={styles.featureIconWrapper}>
                  <Upload className={styles.featureIcon} />
                </div>
                <h3 className={styles.featureTitle}>1. Upload</h3>
                <p className={styles.featureDescription}>Select any image file from your device</p>
              </div>
              <div className={styles.featureItem}>
                <div className={styles.featureIconWrapper}>
                  <Sparkles className={styles.featureIcon} />
                </div>
                <h3 className={styles.featureTitle}>2. Analyze</h3>
                <p className={styles.featureDescription}>AI analyzes the image content and context</p>
              </div>
              <div className={styles.featureItem}>
                <div className={styles.featureIconWrapper}>
                  <Download className={styles.featureIcon} />
                </div>
                <h3 className={styles.featureTitle}>3. Download</h3>
                <p className={styles.featureDescription}>Get your image with a descriptive filename</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
