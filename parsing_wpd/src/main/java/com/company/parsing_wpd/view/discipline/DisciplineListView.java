package com.company.parsing_wpd.view.discipline;

import com.company.parsing_wpd.entity.Discipline;
import com.company.parsing_wpd.entity.StudyPlane;
import com.company.parsing_wpd.view.main.MainView;
import com.vaadin.flow.component.ClickEvent;
import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.html.Anchor;
import com.vaadin.flow.component.upload.Upload;
import com.vaadin.flow.component.upload.receivers.MemoryBuffer;
import com.vaadin.flow.data.renderer.ComponentRenderer;
import com.vaadin.flow.router.QueryParameters;
import com.vaadin.flow.router.Route;
import io.jmix.core.FileRef;
import io.jmix.flowui.component.grid.DataGrid;
import io.jmix.flowui.kit.component.button.JmixButton;
import io.jmix.flowui.view.*;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.springframework.beans.factory.annotation.Autowired;

import java.io.IOException;
import java.util.UUID;


@Route(value = "disciplines", layout = MainView.class)
@ViewController("Discipline.list")
@ViewDescriptor("discipline-list-view.xml")
@LookupComponent("disciplinesDataGrid")
@DialogMode(width = "64em")
public class DisciplineListView extends StandardListView<Discipline> {

    @ViewComponent
    private DataGrid<StudyPlane> studyPlanesDataGrid;

    @Subscribe("parserDiscBtn")
    public void parseDisciplinesButton(ClickEvent<Button> event) {
        if (studyPlanesDataGrid != null) {
            StudyPlane selectedPlan = studyPlanesDataGrid.getSingleSelectedItem();
            if (selectedPlan != null) {
                System.out.println("\n\n Выбран план с ID: " + selectedPlan.getId());
            } else {
                System.out.println("Нет выбранного плана.");
            }
        } else {
            System.out.println("studyPlanesDataGrid is null");
        }
    }

}