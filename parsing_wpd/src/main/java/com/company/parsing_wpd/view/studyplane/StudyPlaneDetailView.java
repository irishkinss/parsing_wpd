package com.company.parsing_wpd.view.studyplane;

import com.company.parsing_wpd.entity.Discipline;
import com.company.parsing_wpd.entity.StudyPlane;
import com.company.parsing_wpd.view.discipline.DisciplineListView;
import com.company.parsing_wpd.view.main.MainView;
import com.vaadin.flow.component.ClickEvent;
import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.grid.Grid;
import com.vaadin.flow.component.html.Anchor;
import com.vaadin.flow.component.notification.Notification;
import com.vaadin.flow.router.QueryParameters;
import com.vaadin.flow.router.Route;
import com.vaadin.flow.router.RouterLink;
import io.jmix.core.DataManager;
import io.jmix.core.FileRef;
import io.jmix.core.FileStorage;
import io.jmix.flowui.component.textfield.TypedTextField;
import io.jmix.flowui.component.upload.FileStorageUploadField;
import io.jmix.flowui.view.*;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.springframework.beans.factory.annotation.Autowired;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.util.HashMap;
import java.util.Map;

import com.company.parsing_wpd.entity.Parser;

@Route(value = "studyPlanes/:id", layout = MainView.class)
@ViewController("StudyPlane.detail")
@ViewDescriptor("study-plane-detail-view.xml")
@EditedEntityContainer("studyPlaneDc")
//@Component
public class StudyPlaneDetailView extends StandardDetailView<StudyPlane> {
    @ViewComponent
    private FileStorageUploadField fileField; // для загрузки файла

    @ViewComponent
    private TypedTextField nameField; // для наименования направления

    @ViewComponent
    private TypedTextField levelEducationField; // для уровня образования

    @ViewComponent
    private TypedTextField codeField; // для кода направления

    @ViewComponent
    private TypedTextField profileField; // для направленности

    @Autowired
    private FileStorage fileStorage;
    @Autowired
    private DataManager dataManager;


    @Subscribe("uploadFileBtn")
    public void parseStudyPlane(ClickEvent<Button> event) {
        PDDocument document = this.documentUpload();

        // Проверка файла
        if (document == null || !Parser.checkTitlePageUPlan(document)) {
            Notification.show("Ошибка: Загруженный файл не является учебным планом!", 3000, Notification.Position.MIDDLE);
            return;
        }

        //Parser pars = new Parser();
        String[] parsedData = Parser.parsingTitlePage(document);

        // Заполняем поля формы
        if (parsedData != null) {
            codeField.setValue(parsedData[0]);  // Код направления
            nameField.setValue(parsedData[1]); // Название направления
            profileField.setValue(parsedData[2]); // Направленность
            levelEducationField.setValue(parsedData[3]); // Уровень образования
        }
    }

//    @Subscribe("saveAndCloseBtn")
//    public void onSaveAndCloseBtnClick(ClickEvent<Button> event) {
//        // Выводим сообщение в консоль
//        System.out.println("Save and Close button clicked!");
//
//        // Загружаем документ
//        PDDocument document = this.documentUpload();
//
//        // Получаем карту дисциплин (коды и имена)
//        Map<String, String> disciplines = Parser.parsingDisciplines(document);
//
//        // Формируем строку с именами дисциплин, разделёнными новой строкой
//        StringBuilder disciplinesString = new StringBuilder();
//        disciplines.forEach((code, name) ->
//                disciplinesString.append(name).append("\n") // Добавляем только имя дисциплины
//        );
//
//        // Сохраняем строку с именами дисциплин в поле listDisciplines объекта StudyPlane
//        StudyPlane studyPlane = getEditedEntity();
//        studyPlane.setListDisciplines(disciplinesString.toString());
//
//        // Сохраняем дисциплины как объекты Discipline в базу данных
//        disciplines.forEach((code, name) -> {
//            Discipline discipline = dataManager.create(Discipline.class);
//            discipline.setCode(code);
//            discipline.setName(name);
//            discipline.setStudyPlane(studyPlane);  // Связываем дисциплину с учебным планом
//
//            // Сохраняем дисциплину в базу данных
//            dataManager.save(discipline);
//        });
//
//        // Пример вывода в консоль
//        System.out.println("Disciplines names saved to StudyPlane:");
//        System.out.println(disciplinesString.toString());
//    }



    public PDDocument documentUpload() {

        FileRef fileRef = fileField.getValue();
        PDDocument document = null;

        if (fileRef != null) {
            try (InputStream inputStream = fileStorage.openStream(fileRef)) {
                // Создаем временный файл с тем же расширением, что и загруженный файл
                File tempFile = Files.createTempFile("upload-", ".pdf").toFile();

                // Записываем содержимое inputStream во временный файл
                try (FileOutputStream outputStream = new FileOutputStream(tempFile)) {
                    inputStream.transferTo(outputStream);
                }

                try {
                    // Загружаем PDF-документ из файла.
                    document = PDDocument.load(tempFile);
                    System.out.println("\n\n PDF document successfully uploaded. \n\n");

                } catch (IOException e) {
                    System.err.println("Load error: " + e.getMessage());
                    e.printStackTrace(); // Выводит стек вызовов ошибки для отладки.
                }

            } catch (Exception e) {
                // Обработайте ошибку чтения файла.
                throw new RuntimeException("Error while processing the file: " + e.getMessage(), e);
            }
        }

        return document;
    }


}