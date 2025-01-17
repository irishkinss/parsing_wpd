//package com.company.parsing_wpd.service;
//
//import com.company.parsing_wpd.entity.StudyPlane;
//import io.jmix.core.DataManager;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//
//import java.util.UUID;
//
//@Service
//public class StudyPlaneServiceImpl implements StudyPlaneService {
//
//    @Autowired
//    private DataManager dataManager;
//
//    @Override
//    public StudyPlane getStudyPlaneById(UUID id) {
//        // Use DataManager's load(id) for efficient retrieval
//        StudyPlane studyPlane = dataManager.load(StudyPlane.class).id(id).one();
//
//        // Optional handling for potential null case
//        return studyPlane;
//    }
//}