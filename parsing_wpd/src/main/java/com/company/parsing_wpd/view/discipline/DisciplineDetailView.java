package com.company.parsing_wpd.view.discipline;

import com.company.parsing_wpd.entity.Discipline;
import com.company.parsing_wpd.entity.Document;
import com.company.parsing_wpd.entity.WPD;
import com.company.parsing_wpd.view.main.MainView;
import com.vaadin.flow.component.ClickEvent;
import com.vaadin.flow.component.HasValue;
import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.router.Route;
import io.jmix.core.DataManager;
import io.jmix.core.FileRef;
import io.jmix.flowui.component.upload.FileStorageUploadField;
import io.jmix.flowui.component.upload.receiver.FileTemporaryStorageBuffer;
import io.jmix.flowui.kit.component.upload.event.FileUploadSucceededEvent;
import io.jmix.flowui.model.InstanceContainer;
import io.jmix.flowui.upload.TemporaryStorage;
import io.jmix.flowui.view.*;
import org.springframework.beans.factory.annotation.Autowired;

import java.io.File;
import java.util.UUID;

@Route(value = "disciplines/:id", layout = MainView.class)
@ViewController("Discipline.detail")
@ViewDescriptor("discipline-detail-view.xml")
@EditedEntityContainer("disciplineDc")
public class DisciplineDetailView extends StandardDetailView<Discipline> {

    @ViewComponent
    private FileStorageUploadField wpdFileField;

    @ViewComponent
    private InstanceContainer<Discipline> disciplineDc;

    @Autowired
    private DataManager dataManager;

    @Autowired
    private TemporaryStorage temporaryStorage;

    @Subscribe
    public void onInit(InitEvent event) {
        wpdFileField.addFileUploadSucceededListener(this::onFileUploadSucceeded);
        wpdFileField.addValueChangeListener(this::onFileFieldValueChange);
    }

    private void onFileUploadSucceeded(FileUploadSucceededEvent<FileStorageUploadField> event) {
        if (event.getReceiver() instanceof FileTemporaryStorageBuffer buffer) {
            UUID fileId = buffer.getFileData().getFileInfo().getId();
            File file = temporaryStorage.getFile(fileId);
            if (file != null) {
                FileRef fileRef = temporaryStorage.putFileIntoStorage(fileId, event.getFileName());
                wpdFileField.setValue(fileRef);

                Discipline discipline = disciplineDc.getItem();

                // Создаем новый объект Document и устанавливаем FileRef
                Document document = dataManager.create(Document.class);
                document.setFile(fileRef);

                // Создаем новый объект WPD и связываем его с Document
                WPD wpd = dataManager.create(WPD.class);
                wpd.setFile(document);

                // Убедитесь, что все обязательные поля заполнены
                wpd.setName("Example Name");
                wpd.setLevelEducation("Bachelor");
                wpd.setCode("12345");
                wpd.setProfile("Engineering");

                // Связываем WPD с Discipline
                discipline.setWpd(wpd);

                // Устанавливаем FileRef в Discipline для transient поля
                discipline.setWpdFile(fileRef);

                // Логирование данных перед сохранением
                System.out.println("Saving Document: " + document);
                System.out.println("Saving WPD: " + wpd);
                System.out.println("Saving Discipline: " + discipline);

                // Сохранение изменений в базе данных
                dataManager.save(document, wpd, discipline);

                // Логирование успешной загрузки
                System.out.println("File uploaded successfully: " + fileRef.getFileName());
            }
        } else {
            // Обработка случая, когда fileRef равен null
            System.out.println("FileRef is null after upload.");
        }
    }

    private void onFileFieldValueChange(HasValue.ValueChangeEvent<FileRef> event) {
        if (event.getValue() == null) {
            // Логика удаления файла
            Discipline discipline = disciplineDc.getItem();
            discipline.setWpdFile(null);
            System.out.println("File removed.");
        }
    }
}