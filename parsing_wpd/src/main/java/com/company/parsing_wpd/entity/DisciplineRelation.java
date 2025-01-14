package com.company.parsing_wpd.entity;

import io.jmix.core.DeletePolicy;
import io.jmix.core.entity.annotation.JmixGeneratedValue;
import io.jmix.core.entity.annotation.OnDeleteInverse;
import io.jmix.core.metamodel.annotation.Composition;
import io.jmix.core.metamodel.annotation.JmixEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

@JmixEntity
@Table(name = "DISCIPLINE_RELATION", indexes = {
        @Index(name = "IDX_DISCIPLINE_RELATION_WPD", columnList = "WPD_ID"),
        @Index(name = "IDX_DISCIPLINE_RELATION_MAIN_DISCIPLINE", columnList = "MAIN_DISCIPLINE_ID"),
        @Index(name = "IDX_DISCIPLINE_RELATION_RELATED_DISCIPLINE", columnList = "RELATED_DISCIPLINE_ID")
})
@Entity
public class DisciplineRelation {
    @JmixGeneratedValue
    @Column(name = "ID", nullable = false)
    @Id
    private UUID id;

    @JoinColumn(name = "WPD_ID", nullable = false)
    @NotNull
    @OneToOne(fetch = FetchType.LAZY, optional = false)
    private WPD wpd;

    @OnDeleteInverse(DeletePolicy.CASCADE)
    @JoinColumn(name = "MAIN_DISCIPLINE_ID", nullable = false)
    @Composition
    @NotNull
    @OneToOne(fetch = FetchType.LAZY, optional = false)
    private Discipline mainDiscipline;

    @OnDeleteInverse(DeletePolicy.CASCADE)
    @JoinColumn(name = "RELATED_DISCIPLINE_ID")
    @Composition
    @OneToOne(fetch = FetchType.LAZY)
    private Discipline relatedDiscipline;

    @Column(name = "RELATION_TYPE", nullable = false)
    @NotNull
    private Boolean relationType = false;

    public Boolean getRelationType() {
        return relationType;
    }

    public void setRelationType(Boolean relationType) {
        this.relationType = relationType;
    }

    public Discipline getRelatedDiscipline() {
        return relatedDiscipline;
    }

    public void setRelatedDiscipline(Discipline relatedDiscipline) {
        this.relatedDiscipline = relatedDiscipline;
    }

    public Discipline getMainDiscipline() {
        return mainDiscipline;
    }

    public void setMainDiscipline(Discipline mainDiscipline) {
        this.mainDiscipline = mainDiscipline;
    }

    public WPD getWpd() {
        return wpd;
    }

    public void setWpd(WPD wpd) {
        this.wpd = wpd;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }
}