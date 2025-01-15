package com.company.parsing_wpd.view.studyplane;

import com.company.parsing_wpd.entity.StudyPlane;
import com.company.parsing_wpd.view.main.MainView;
import com.vaadin.flow.component.ClickEvent;
import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.router.Route;
import io.jmix.core.DataManager;
import io.jmix.core.FileRef;
import io.jmix.core.FileStorage;
import io.jmix.core.event.EntitySavingEvent;
import io.jmix.flowui.component.upload.FileStorageUploadField;
import io.jmix.flowui.kit.action.ActionPerformedEvent;
import io.jmix.flowui.view.*;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.springframework.beans.factory.annotation.Autowired;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;


import com.company.parsing_wpd.entity.Parser;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Route(value = "studyPlanes/:id", layout = MainView.class)
@ViewController("StudyPlane.detail")
@ViewDescriptor("study-plane-detail-view.xml")
@EditedEntityContainer("studyPlaneDc")
//@Component
public class StudyPlaneDetailView extends StandardDetailView<StudyPlane> {
    @ViewComponent
    private FileStorageUploadField fileField;


    @Autowired
    private FileStorage fileStorage;
    @Autowired
    private DataManager dataManager;


    @Subscribe("uploadFileBtn")
    public void parseStudyPlane(ClickEvent<Button> event) {
        PDDocument document = this.documentUpload();
        Parser pars = new Parser();
        pars.parsingTitlePage(document);


    }

    public PDDocument documentUpload() {

        System.out.println("onBeforeSaveEntity called!");
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

                // Теперь у вас есть объект File, который представляет загруженный PDF
                System.out.println("Temporary file created: " + tempFile.getAbsolutePath());


                try {
                    // Загружаем PDF-документ из файла.
                    document = PDDocument.load(tempFile);

                    // Теперь 'document' является объектом PDDocument, с которым можно работать.
                    System.out.println("\n\n PDF document successfully uploaded. \n\n");

                    // Например, можно получить количество страниц:
                    int numberOfPages = document.getNumberOfPages();
                    System.out.println("Количество страниц: " + numberOfPages);

                    // После работы с документом, обязательно его нужно закрыть.
//                    document.close();

//                    return document;


                } catch (IOException e) {
                    System.err.println("Ошибка при загрузке PDF-документа: " + e.getMessage());
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