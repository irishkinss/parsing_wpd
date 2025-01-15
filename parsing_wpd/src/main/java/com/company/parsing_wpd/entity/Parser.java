package com.company.parsing_wpd.entity;

import io.jmix.core.entity.annotation.JmixGeneratedValue;
import io.jmix.core.entity.annotation.JmixId;
import io.jmix.core.metamodel.annotation.JmixEntity;
import jakarta.persistence.Entity;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import java.util.UUID;

@JmixEntity
public class Parser {
    @JmixGeneratedValue
    @JmixId
    private UUID id;

    private Document doc;

    // Константные списки для форм обучения, квалификаций и исключений
    private static final List<String> STUDY_FORMS = Arrays.asList("очная", "очно-заочная", "заочная");
    private static final List<String> LEVEL_EDUCATIONS = Arrays.asList("бакалавр", "магистр", "аспирант", "специалист");
    private static List<String> EXCLUDED_PATTERNS = Arrays.asList(
            "ФТД Факультативы",
            "Б2 Практики",
            "Б3.Д ",
            "Б3.Г",
            "Индекс",
            "Наименование",
            "Каф",
            "Формируемые компетенции",
            "Б1 Дисциплины (модули)",
            "Б3 Государственная итоговая аттестация",
            "Подготовка и сдача",
            "(индекс"
    );

    public Parser(Document doc) {
        this.doc = doc;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public Document getDoc() {
        return doc;
    }

    public void setDoc(Document doc) {
        this.doc = doc;
    }

    // парсинг первой страницы для поиска наименования направления, кода и тп
    public static void parsingTitlePage(PDDocument document) {
        try {
            // Настроим PDFTextStripper для извлечения текста только с первой страницы
            PDFTextStripper textStripper = new PDFTextStripper();
            textStripper.setStartPage(1);
            textStripper.setEndPage(1);

            // Извлекаем текст с первой страницы
            String text = textStripper.getText(document);

            // Удаляем кавычки из текста
            text = text.replace("\"", "");

            // Ищем строку с "Направление" и извлекаем код и название
            String[] lines = text.split("\n");
            String directionCode = "";
            String directionName = "";
            String directionProfile = "";
            String studyForm = "";
            String levelEducation = "";

            for (int i = 0; i < lines.length; i++) {
                String line = lines[i].trim();

                // Проверяем, содержит ли строка слово "Направление"
                if (line.contains("Направление")) {
                    // Пытаемся извлечь код направления и название
                    String regex = "(\\d{2}\\.\\d{2}\\.\\d{2})\\s+(.+)"; // Формат: Код (ЦифраЦифра.ЦифраЦифра.ЦифраЦифра) и название
                    Pattern pattern = Pattern.compile(regex);
                    Matcher matcher = pattern.matcher(line);

                    if (matcher.find()) {
                        directionCode = matcher.group(1);
                        directionName = matcher.group(2);
                    }
                }

                // Ищем строку с "Направленность" и извлекаем подстроку после слова "Направленность"
                if (line.contains("Направленность")) {
                    int index = line.indexOf("Направленность");
                    String focusPart = line.substring(index + "Направленность".length()).trim();

                    // Убираем дефис в конце строки, если он есть
                    if (focusPart.endsWith("-")) {
                        focusPart = focusPart.substring(0, focusPart.length() - 1).trim();
                    }

                    // Проверяем, если предпоследние символы строки " и", то добавляем пробел
                    if (focusPart.length() > 2 && focusPart.substring(focusPart.length() - 2).equals(" и")) {
                        focusPart = focusPart + " "; // добавляем пробел
                    }

                    // Ищем первую заглавную букву и извлекаем текст до конца строки
                    Pattern focusPattern = Pattern.compile("[А-ЯЁ].*");
                    Matcher focusMatcher = focusPattern.matcher(focusPart);
                    if (focusMatcher.find()) {
                        directionProfile = focusMatcher.group();
                    }

                    // Если следующая строка не пустая и начинается с маленькой буквы, добавляем её
                    if (i + 1 < lines.length) {
                        String nextLine = lines[i + 1].trim();  // Следующая строка

                        // Если следующая строка не пустая и начинается с маленькой буквы, добавляем её
                        if (!nextLine.isEmpty() && Character.isLowerCase(nextLine.charAt(0))) {
                            directionProfile += nextLine;
                        }
                    }
                }

                // Проверяем на форму обучения
                if (studyForm.isEmpty()) {
                    for (String form : STUDY_FORMS) {
                        if (line.contains(form)) {
                            studyForm = form;
                            break;
                        }
                    }
                }

                // Проверяем на квалификацию
                if (levelEducation.isEmpty()) {
                    for (String qual : LEVEL_EDUCATIONS) {
                        if (line.contains(qual)) {
                            levelEducation = qual;
                            break;
                        }
                    }
                }
            }

            // Место для сохранения в БД
            // Здесь можно отправить данные (directionCode, directionName, directionProfile, studyForm, levelEducation) в базу данных

        } catch (IOException e) {
            e.printStackTrace();
        }
    }



}