package com.company.parsing_wpd.entity;

import io.jmix.core.entity.annotation.JmixGeneratedValue;
import io.jmix.core.entity.annotation.JmixId;
import io.jmix.core.metamodel.annotation.InstanceName;
import io.jmix.core.metamodel.annotation.JmixEntity;
import io.jmix.core.metamodel.annotation.JmixProperty;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;
import java.util.UUID;

@JmixEntity
public class Document {
    @JmixGeneratedValue
    @JmixId
    private UUID id;

    @InstanceName
    @JmixProperty(mandatory = true)
    @NotNull
    private String name;

    private LocalDateTime dateAdd;

    private User addBy;

    public User getAddBy() {
        return addBy;
    }

    public void setAddBy(User addBy) {
        this.addBy = addBy;
    }

    public LocalDateTime getDateAdd() {
        return dateAdd;
    }

    public void setDateAdd(LocalDateTime dateAdd) {
        this.dateAdd = dateAdd;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }
}