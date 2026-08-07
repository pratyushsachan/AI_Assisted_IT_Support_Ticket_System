package com.support.ticketai.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

/**
 * The JSON shape we ASK the AI model to return (see AiClassificationService.buildPrompt).
 * category/priority are kept as raw Strings here (not the enum types directly)
 * because the AI could occasionally return something unexpected — we validate
 * and safely fall back to a default in AiClassificationService rather than
 * letting a bad AI response crash the whole request.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class AiClassificationResult {

    private String category;
    private String priority;
    private String suggestedResponse;

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public String getSuggestedResponse() {
        return suggestedResponse;
    }

    public void setSuggestedResponse(String suggestedResponse) {
        this.suggestedResponse = suggestedResponse;
    }
}
