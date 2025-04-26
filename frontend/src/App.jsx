import { useState } from "react";
import axios from "axios";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [extractedText, setExtractedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [filePreview, setFilePreview] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    
    // Create preview for the image
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setFilePreview(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select an image file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      setLoading(true);
      const response = await axios.post("https://text-scanner-production.up.railway.app/extract-text/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setExtractedText(response.data.text);
      navigator.clipboard.writeText(response.data.text);
      alert("Text copied to clipboard!");
    } catch (error) {
      console.error("Error extracting text:", error);
      alert("Failed to extract text.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "white", // Changed to white
      padding: "20px",
    }}>
      <div style={{
        padding: "40px",
        width: "100%",
        maxWidth: "900px",
        textAlign: "center",
      }}>
        <h2 style={{ 
          marginBottom: "30px", 
          color: "#333", 
          fontSize: "28px",
          fontWeight: "600"
        }}>📝 OCR Text Scanner</h2>

        <div style={{
          display: "flex",
          flexDirection: "row",
          gap: "20px",
          marginBottom: "20px",
          alignItems: "center",
          flexWrap: "wrap",
          justifyContent: "center",
        }}>
          <div style={{
            flex: "1",
            minWidth: "250px",
          }}>
            <div style={{
              border: "2px dashed #ddd",
              padding: "30px 20px",
              borderRadius: "12px",
              marginBottom: "15px",
              position: "relative",
              transition: "all 0.3s",
              ':hover': {
                borderColor: "#4CAF50",
              }
            }}>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  top: "0",
                  left: "0",
                  opacity: "0",
                  cursor: "pointer",
                }}
                id="fileInput"
              />
              <label htmlFor="fileInput" style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7"></path>
                  <line x1="16" y1="5" x2="22" y2="5"></line>
                  <line x1="19" y1="2" x2="19" y2="8"></line>
                  <circle cx="9" cy="9" r="2"></circle>
                  <path d="M21 15l-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
                </svg>
                <span style={{ 
                  marginTop: "15px", 
                  color: "#555",
                  fontSize: "16px"
                }}>
                  {selectedFile ? selectedFile.name : "Choose an image file"}
                </span>
              </label>
            </div>
          </div>

          {filePreview && (
            <div style={{
              flex: "1",
              minWidth: "250px",
              height: "200px",
              borderRadius: "12px",
              overflow: "hidden",
              border: "1px solid #eee",
              boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
            }}>
              <img 
                src={filePreview} 
                alt="Preview" 
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  backgroundColor: "#f9f9f9",
                }}
              />
            </div>
          )}
        </div>

        <button
          onClick={handleUpload}
          disabled={loading || !selectedFile}
          style={{
            backgroundColor: selectedFile ? "#4CAF50" : "#e0e0e0",
            color: selectedFile ? "white" : "#aaa",
            padding: "15px 25px",
            border: "none",
            borderRadius: "8px",
            cursor: selectedFile ? "pointer" : "not-allowed",
            fontSize: "16px",
            width: "100%",
            maxWidth: "400px",
            margin: "0 auto 25px auto",
            transition: "all 0.3s",
            boxShadow: selectedFile ? "0 4px 12px rgba(76, 175, 80, 0.3)" : "none",
          }}
          onMouseOver={(e) => selectedFile && (e.target.style.backgroundColor = "#45a049")}
          onMouseOut={(e) => selectedFile && (e.target.style.backgroundColor = "#4CAF50")}
        >
          {loading ? (
            <>
              <svg style={{ marginRight: "8px", verticalAlign: "middle" }} width="16" height="16" viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient x1="8.042%" y1="0%" x2="65.682%" y2="23.865%" id="a">
                    <stop stopColor="#fff" stopOpacity="0" offset="0%"/>
                    <stop stopColor="#fff" stopOpacity=".631" offset="63.146%"/>
                    <stop stopColor="#fff" offset="100%"/>
                  </linearGradient>
                </defs>
                <g fill="none" fillRule="evenodd">
                  <g transform="translate(1 1)">
                    <path d="M36 18c0-9.94-8.06-18-18-18" stroke="currentColor" strokeWidth="2">
                      <animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="0.9s" repeatCount="indefinite"/>
                    </path>
                    <circle fill="#fff" cx="36" cy="18" r="1">
                      <animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="0.9s" repeatCount="indefinite"/>
                    </circle>
                  </g>
                </g>
              </svg>
              Extracting...
            </>
          ) : "Extract Text"}
        </button>

        {extractedText && (
          <div style={{
            margin: "0 auto",
            backgroundColor: "#f8f8f8",
            padding: "25px",
            borderRadius: "12px",
            textAlign: "left",
            maxHeight: "300px",
            overflowY: "auto",
            maxWidth: "800px",
            border: "1px solid #eee",
          }}>
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center", 
              marginBottom: "15px" 
            }}>
              <h3 style={{ 
                color: "#555", 
                margin: "0",
                fontSize: "18px",
                fontWeight: "500"
              }}>Extracted Text:</h3>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(extractedText);
                  alert("Text copied to clipboard!");
                }}
                style={{
                  backgroundColor: "#4CAF50",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  padding: "8px 15px",
                  cursor: "pointer",
                  fontSize: "14px",
                  transition: "all 0.2s",
                  ':hover': {
                    backgroundColor: "#45a049",
                  }
                }}
              >
                Copy
              </button>
            </div>
            <p style={{ 
              whiteSpace: "pre-wrap", 
              color: "#333", 
              margin: "0",
              lineHeight: "1.6",
              fontSize: "15px"
            }}>{extractedText}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;