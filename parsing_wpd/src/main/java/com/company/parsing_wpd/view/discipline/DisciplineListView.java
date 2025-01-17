package com.company.parsing_wpd.view.discipline;

import com.company.parsing_wpd.entity.Discipline;
import com.company.parsing_wpd.entity.StudyPlane;
import com.company.parsing_wpd.view.main.MainView;
import com.vaadin.flow.component.ClickEvent;
import com.vaadin.flow.component.Component;
import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.html.Anchor;
import com.vaadin.flow.component.upload.Upload;
import com.vaadin.flow.component.upload.receivers.MemoryBuffer;
import com.vaadin.flow.data.renderer.ComponentRenderer;
import com.vaadin.flow.router.QueryParameters;
import com.vaadin.flow.router.Route;
import io.jmix.core.DataManager;
import io.jmix.core.FileRef;
import io.jmix.flowui.component.grid.DataGrid;
import io.jmix.flowui.facet.UrlQueryParametersFacet;
import io.jmix.flowui.facet.urlqueryparameters.AbstractUrlQueryParametersBinder;
import io.jmix.flowui.kit.component.button.JmixButton;
import io.jmix.flowui.view.*;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.springframework.beans.factory.annotation.Autowired;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@Route(value = "disciplines", layout = MainView.class)
@ViewController("Discipline.list")
@ViewDescriptor("discipline-list-view.xml")
@LookupComponent("disciplinesDataGrid")
@DialogMode(width = "64em")
public class DisciplineListView extends StandardListView<Discipline> {

    @Autowired
    private DataManager dataManager;

    private StudyPlane selectedStudyPlane;

    @ViewComponent
    private UrlQueryParametersFacet urlQueryParameters;

    @Subscribe
    public void onInit(InitEvent event) {
        // Регистрация кастомного биндинга
        urlQueryParameters.registerBinder(new AbstractUrlQueryParametersBinder() {
            @Override
            public void updateState(QueryParameters queryParameters) {
                // Получаем параметр studyPlanId как список строк
                List<String> studyPlanIds = queryParameters.getParameters().get("studyPlanId");
                if (studyPlanIds != null && !studyPlanIds.isEmpty()) {
                    // Извлекаем первый элемент из списка
                    String studyPlanId = studyPlanIds.get(0);
                    selectedStudyPlane = dataManager.load(StudyPlane.class)
                            .id(UUID.fromString(studyPlanId))
                            .one();
                }
            }

            @Override
            public Component getComponent() {
                return null; // Не привязываем к конкретному компоненту
            }
        });
    }


    @Subscribe("parserDiscBtn")
    public void parseDisciplinesButton(ClickEvent<Button> event) {
        if (selectedStudyPlane != null) {
            System.out.println("\n\n Select plan with ID: " + selectedStudyPlane.getId());

            //Загружаем документ
            //PDDocument document = this.documentUpload();
        } else {
            System.out.println("\n\n none.");
        }
    }
}