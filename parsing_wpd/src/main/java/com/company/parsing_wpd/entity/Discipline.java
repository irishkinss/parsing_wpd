package com.company.parsing_wpd.entity;

import io.jmix.core.DeletePolicy;
import io.jmix.core.FileRef;
import io.jmix.core.entity.annotation.JmixGeneratedValue;
import io.jmix.core.entity.annotation.OnDeleteInverse;
import io.jmix.core.metamodel.annotation.InstanceName;
import io.jmix.core.metamodel.annotation.JmixEntity;
import io.jmix.core.metamodel.annotation.JmixProperty;
import jakarta.persistence.*;

import java.util.UUID;

@JmixEntity
@Table(name = "DISCIPLINE", indexes = {
        @Index(name = "IDX_DISCIPLINE_STUDY_PLANE", columnList = "STUDY_PLANE_ID"),
        @Index(name = "IDX_DISCIPLINE_WPD", columnList = "WPD_ID")
})
@Entity
public class Discipline {
    @JmixGeneratedValue
    @Column(name = "ID", nullable = false)
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @JoinColumn(name = "WPD_ID")
    @OneToOne(fetch = FetchType.LAZY)
    private WPD wpd;
    @InstanceName
    @Column(name = "NAME")
    private String name;

    @Column(name = "IS_ROOT")
    private Boolean isRoot;

    @Column(name = "CODE")
    private String code;

    @OnDeleteInverse(DeletePolicy.CASCADE)
    @JoinColumn(name = "STUDY_PLANE_ID", nullable = false)
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private StudyPlane studyPlane;

    public WPD getWpd() {
        return wpd;
    }

    public void setWpd(WPD wpd) {
        this.wpd = wpd;
    }

    public Boolean getIsRoot() {
        return isRoot;
    }

    public void setIsRoot(Boolean isRoot) {
        this.isRoot = isRoot;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public StudyPlane getStudyPlane() {
        return studyPlane;
    }

    public void setStudyPlane(StudyPlane studyPlane) {
        this.studyPlane = studyPlane;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public void setWpdFile(FileRef fileRef) {
        if (wpd == null) {
            wpd = new WPD();
        }
        wpd.setFile(fileRef);
    }

    @Transient
    @JmixProperty
    private FileRef wpdFile;

    public FileRef getWpdFile() {
        if (wpd != null && wpd.getFile() != null) {
            return wpd.getFile().getFile();
        }
        return null;
    }
}