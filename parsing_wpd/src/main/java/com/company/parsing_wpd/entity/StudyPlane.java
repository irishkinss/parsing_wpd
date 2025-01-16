package com.company.parsing_wpd.entity;

import io.jmix.core.FileRef;
import io.jmix.core.entity.annotation.JmixGeneratedValue;
import io.jmix.core.metamodel.annotation.Composition;
import io.jmix.core.metamodel.annotation.InstanceName;
import io.jmix.core.metamodel.annotation.JmixEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

import java.util.List;
import java.util.UUID;

@JmixEntity
@Table(name = "STUDY_PLANE")
@Entity
public class StudyPlane {
    @JmixGeneratedValue
    @Column(name = "ID", nullable = false)
    @Id
    private UUID id;

    @Column(name = "FILE_ID", length = 1024)
    private FileRef file;

    @Column(name = "LIST_DISCIPLINES")
    @Lob
    private String listDisciplines;
    @InstanceName
    @Column(name = "NAME", nullable = false)
    @NotNull
    private String name;

    @Column(name = "LEVEL_EDUCATION", nullable = false)
    @NotNull
    private String levelEducation;

    @Column(name = "CODE", nullable = false)
    @NotNull
    private String code;

    @Column(name = "PROFILE", nullable = false)
    @NotNull
    private String profile;

    @Composition
    @OrderBy("code")
    @OneToMany(mappedBy = "studyPlane")
    private List<Discipline> disciplines;

    public String getListDisciplines() {
        return listDisciplines;
    }

    public void setListDisciplines(String listDisciplines) {
        this.listDisciplines = listDisciplines;
    }

    public FileRef getFile() {
        return file;
    }

    public void setFile(FileRef file) {
        this.file = file;
    }

    public List<Discipline> getDisciplines() {
        return disciplines;
    }

    public void setDisciplines(List<Discipline> disciplines) {
        this.disciplines = disciplines;
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