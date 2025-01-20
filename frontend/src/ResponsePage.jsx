import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./App.css";

function ResponsePage() {
    const location = useLocation();
    const navigate = useNavigate();
    const responseMessage = location.state;

    if (!responseMessage) {
        return (
            <div className="response-container error">
                <h1>Error</h1>
                <p>No data found. Please submit the form first.</p>
                <button onClick={() => navigate("/")}>Back to Form</button>
            </div>
        );
    }

    return (
        <div className="response-container">
            <h1>Application Response</h1>
            <h2>{responseMessage.message}</h2>
            <div className="response-data">
                {Object.entries(responseMessage.data).map(([key, value]) => (
                    <div key={key} className="data-item">
                        <strong>{key}:</strong>
                        {typeof value === "object" ? (
                            <div className="nested-data">
                                {Object.entries(value).map(([nestedKey, nestedValue]) => (
                                    <div key={nestedKey}>
                                        <strong>{nestedKey}:</strong> {nestedValue}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <span>{value}</span>
                        )}
                    </div>
                ))}
            </div>
            <button onClick={() => navigate("/")}>Back to Form</button>
        </div>
    );
}

export default ResponsePage;
