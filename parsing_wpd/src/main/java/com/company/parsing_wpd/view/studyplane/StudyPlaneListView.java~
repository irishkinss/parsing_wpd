package com.company.parsing_wpd.view.studyplane;

import com.company.parsing_wpd.entity.StudyPlane;
import com.company.parsing_wpd.view.disciplinelistofstudyplane.DisciplineListOfStudyPlaneView;
import com.company.parsing_wpd.view.main.MainView;
import com.company.parsing_wpd.view.discipline.*; // Import для перехода на страницу дисциплин
import com.vaadin.flow.component.html.Anchor;
import com.vaadin.flow.data.renderer.ComponentRenderer;
import com.vaadin.flow.data.renderer.Renderer;
import com.vaadin.flow.router.Route;
import com.vaadin.flow.router.RouterLink;
import io.jmix.flowui.view.*;

@Route(value = "studyPlanes", layout = MainView.class)
@ViewController("StudyPlane.list")
@ViewDescriptor("study-plane-list-view.xml")
@LookupComponent("studyPlanesDataGrid")
@DialogMode(width = "64em")
public class StudyPlaneListView extends StandardListView<StudyPlane> {
    @Supply(to = "studyPlanesDataGrid.name", subject = "renderer")
    private Renderer<StudyPlane> studyPlanesDataGridNameRenderer() {
        return new ComponentRenderer<>(studyPlane -> {
            RouterLink routerLink = new RouterLink(studyPlane.getName(), DisciplineListOfStudyPlaneView.class);
            //Create anchor with link from routerLink
            Anchor anchor = new Anchor();
            anchor.setHref(routerLink.getHref());
            anchor.setText(studyPlane.getName());
            return anchor;
    } );
    }


}