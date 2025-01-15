package com.company.parsing_wpd.entity;

import io.jmix.core.DeletePolicy;
import io.jmix.core.entity.annotation.JmixGeneratedValue;
import io.jmix.core.entity.annotation.OnDeleteInverse;
import io.jmix.core.metamodel.annotation.JmixEntity;
import jakarta.persistence.*;

import java.util.UUID;

@JmixEntity
@Table(name = "DISCIPLINE", indexes = {
        @Index(name = "IDX_DISCIPLINE_STUDY_PLANE", columnList = "STUDY_PLANE_ID")
})
@Entity
public class Discipline {
    @JmixGeneratedValue
    @Column(name = "ID", nullable = false)
    @Id
    private UUID id;

    @Column(name = "CODE")
    private String code;

    @OnDeleteInverse(DeletePolicy.CASCADE)
    @JoinColumn(name = "STUDY_PLANE_ID", nullable = false)
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private StudyPlane studyPlane;

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
}