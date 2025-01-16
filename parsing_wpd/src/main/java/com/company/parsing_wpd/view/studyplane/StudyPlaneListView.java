package com.company.parsing_wpd.view.studyplane;

import com.company.parsing_wpd.entity.StudyPlane;
import com.company.parsing_wpd.view.discipline.DisciplineListView;
import com.company.parsing_wpd.view.main.MainView;
import com.vaadin.flow.component.html.Anchor;
import com.vaadin.flow.data.renderer.ComponentRenderer;
import com.vaadin.flow.router.QueryParameters;
import com.vaadin.flow.router.Route;
import io.jmix.flowui.ViewNavigators;
import io.jmix.flowui.component.grid.DataGrid;
import io.jmix.flowui.view.*;
import org.springframework.beans.factory.annotation.Autowired;

@Route(value = "studyPlanes", layout = MainView.class)
@ViewController("StudyPlane.list")
@ViewDescriptor("study-plane-list-view.xml")
@LookupComponent("studyPlanesDataGrid")
@DialogMode(width = "64em")
public class StudyPlaneListView extends StandardListView<StudyPlane> {

    @ViewComponent
    private DataGrid<StudyPlane> studyPlanesDataGrid;

    @Autowired
    private ViewNavigators viewNavigators;

    @Subscribe
    public void onInit(InitEvent event) {
        studyPlanesDataGrid.addColumn(new ComponentRenderer<>(studyPlane -> {
            Anchor link = new Anchor();
            link.setText("Перейти");
            link.getElement().addEventListener("click", e -> {
                // Программно выбираем учебный план
                studyPlanesDataGrid.select(studyPlane);

                viewNavigators.view(this, DisciplineListView.class)
                        .withQueryParameters(QueryParameters.of("studyPlanId", studyPlane.getId().toString()))
                        .navigate();
            });
            return link;
        })).setHeader("Список дисциплин");
    }
}

