package com.support.ticketai.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

/**
 * Request body shape for Groq's chat completions API — it's OpenAI-compatible,
 * so this same shape would also work against OpenAI's API with only the
 * base URL changed.
 * https://console.groq.com/docs/api-reference#chat-create
 */
public class GroqRequest {

    private String model;
    private List<ChatMessage> messages;
    private double temperature;

    @JsonProperty("response_format")
    private ResponseFormat responseFormat;

    public GroqRequest() {
    }

    public GroqRequest(String model, List<ChatMessage> messages, double temperature, ResponseFormat responseFormat) {
        this.model = model;
        this.messages = messages;
        this.temperature = temperature;
        this.responseFormat = responseFormat;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public List<ChatMessage> getMessages() {
        return messages;
    }

    public void setMessages(List<ChatMessage> messages) {
        this.messages = messages;
    }

    public double getTemperature() {
        return temperature;
    }

    public void setTemperature(double temperature) {
        this.temperature = temperature;
    }

    public ResponseFormat getResponseFormat() {
        return responseFormat;
    }

    public void setResponseFormat(ResponseFormat responseFormat) {
        this.responseFormat = responseFormat;
    }

    /** Forces the model to return raw JSON (no markdown fences). */
    public static class ResponseFormat {
        private String type;

        public ResponseFormat() {
        }

        public ResponseFormat(String type) {
            this.type = type;
        }

        public String getType() {
            return type;
        }

        public void setType(String type) {
            this.type = type;
        }
    }
}
