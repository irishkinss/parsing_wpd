package com.company.parsing_wpd.view.studyplane;

import com.company.parsing_wpd.entity.StudyPlane;
import com.company.parsing_wpd.view.main.MainView;
import com.vaadin.flow.router.Route;
import io.jmix.flowui.view.*;


@Route(value = "studyPlanes", layout = MainView.class)
@ViewController("StudyPlane.list")
@ViewDescriptor("study-plane-list-view.xml")
@LookupComponent("studyPlanesDataGrid")
@DialogMode(width = "64em")
public class StudyPlaneListView extends StandardListView<StudyPlane> {

}