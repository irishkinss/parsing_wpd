package com.company.parsing_wpd.entity;

import io.jmix.core.DeletePolicy;
import io.jmix.core.entity.annotation.JmixGeneratedValue;
import io.jmix.core.entity.annotation.OnDeleteInverse;
import io.jmix.core.metamodel.annotation.Composition;
import io.jmix.core.metamodel.annotation.InstanceName;
import io.jmix.core.metamodel.annotation.JmixEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

@JmixEntity
@Table(name = "WPD", indexes = {
        @Index(name = "IDX_WPD_DISCIPLINE", columnList = "DISCIPLINE_ID"),
        @Index(name = "IDX_WPD_FILE", columnList = "FILE_ID")
})
@Entity
public class WPD {
    @JmixGeneratedValue
    @Column(name = "ID", nullable = false)
    @Id
    private UUID id;

    @JoinColumn(name = "FILE_ID")
    @OneToOne(fetch = FetchType.LAZY)
    private Document file;

    @InstanceName
    @Column(name = "NAME", nullable = false)
    @NotNull
    private String name;

    @OnDeleteInverse(DeletePolicy.CASCADE)
    @JoinColumn(name = "DISCIPLINE_ID")
    @Composition
    @OneToOne(fetch = FetchType.LAZY)
    private Discipline discipline;

    @Column(name = "LEVEL_EDUCATION", nullable = false)
    @NotNull
    private String levelEducation;

    @Column(name = "CODE", nullable = false)
    @NotNull
    private String code;

    @Column(name = "PROFILE", nullable = false)
    @NotNull
    private String profile;

    public Document getFile() {
        return file;
    }

    public void setFile(Document file) {
        this.file = file;
    }

    public String getProfile() {
        return profile;
    }

    public void setProfile(String profile) {
        this.profile = profile;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getLevelEducation() {
        return levelEducation;
    }

    public void setLevelEducation(String levelEducation) {
        this.levelEducation = levelEducation;
    }

    public Discipline getDiscipline() {
        return discipline;
    }

    public void setDiscipline(Discipline discipline) {
        this.discipline = discipline;
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