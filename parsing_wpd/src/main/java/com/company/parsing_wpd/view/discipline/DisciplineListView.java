package com.company.parsing_wpd.view.discipline;

import com.company.parsing_wpd.entity.Discipline;
import com.company.parsing_wpd.entity.Parser;
import com.company.parsing_wpd.entity.StudyPlane;
import com.company.parsing_wpd.view.main.MainView;
import com.vaadin.flow.component.ClickEvent;
import com.vaadin.flow.component.Component;
import com.vaadin.flow.component.UI;
import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.notification.Notification;
import com.vaadin.flow.router.QueryParameters;
import com.vaadin.flow.router.Route;
import io.jmix.core.*;
import io.jmix.flowui.facet.UrlQueryParametersFacet;
import io.jmix.flowui.facet.urlqueryparameters.AbstractUrlQueryParametersBinder;
import io.jmix.flowui.view.*;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.ArrayList;
import java.util.List;

import java.io.IOException;
import java.io.InputStream;
import java.util.Map;
import java.util.UUID;

@Route(value = "disciplines", layout = MainView.class)
@ViewController("Discipline.list")
@ViewDescriptor("discipline-list-view.xml")
@LookupComponent("disciplinesDataGrid")
@DialogMode(width = "64em")
public class DisciplineListView extends StandardListView<Discipline> {

    @Autowired
    private DataManager dataManager;

    @Autowired
    private FileStorage fileStorage;

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

            try {
                FileRef fileRef = selectedStudyPlane.getFile();
                if (fileRef != null) {
                    // Используем openStream для получения InputStream
                    try (InputStream inputStream = fileStorage.openStream(fileRef)) {
                        // Создаем объект PDDocument из InputStream
                        PDDocument document = PDDocument.load(inputStream);
                        // Получаем карту дисциплин (коды и имена)
                        Map<String, String> disciplines = Parser.parsingDisciplines(document);

                        // Создаем список для сохранения всех дисциплин
                        List<Discipline> disciplineList = new ArrayList<>();

                        for (Map.Entry<String, String> entry : disciplines.entrySet()) {
                            String code = entry.getKey();
                            String name = entry.getValue();
                            System.out.println("Code: " + code + ", name: " + name);

                            // Создаем новую сущность Discipline
                            Discipline discipline = dataManager.create(Discipline.class);
                            discipline.setCode(code);
                            discipline.setName(name);
                            discipline.setStudyPlane(selectedStudyPlane);

                            // Добавляем в список
                            disciplineList.add(discipline);
                        }

                        // Сохраняем все дисциплины в базе данных
                        dataManager.save(new SaveContext().saving(disciplineList));

                        // Перезагрузка страницы
                        UI.getCurrent().getPage().reload();

                        Notification.show("Парсинг выполнен!", 3000, Notification.Position.MIDDLE);
                    }
                } else {
                    System.out.println("\n\nFile not found.");
                }
            } catch (IOException | FileStorageException e) {
                // Обработка исключений
                e.printStackTrace();
                // Вывести сообщение пользователю о возникшей ошибке
                Notification.show("Ошибка при обработке файла!");
            }
        } else {
            System.out.println("\n\n Plan not selected.");
        }
    }

}