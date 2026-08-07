package com.support.ticketai.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.List;

/**
 * Response body shape from Groq's chat completions API (OpenAI-compatible).
 * @JsonIgnoreProperties(ignoreUnknown = true) because the real response
 * includes extra fields (usage, id, created, etc.) we don't need to model.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class GroqResponse {

    private List<Choice> choices;

    public List<Choice> getChoices() {
        return choices;
    }

    public void setChoices(List<Choice> choices) {
        this.choices = choices;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Choice {
        private ChatMessage message;

        public ChatMessage getMessage() {
            return message;
        }

        public void setMessage(ChatMessage message) {
            this.message = message;
        }
    }
}
