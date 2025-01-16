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
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@JmixEntity
public class Parser {
    @JmixGeneratedValue
    @JmixId
    private UUID id;

//    private PDDocument doc;

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



    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    // Метод для проверки первой страницы на наличие фразы "УЧЕБНЫЙ ПЛАН"
    public static boolean checkTitlePageUPlan(PDDocument document) {
        try {

            // Извлечение текста с первой страницы
            PDFTextStripper pdfStripper = new PDFTextStripper();
            pdfStripper.setStartPage(1);
            pdfStripper.setEndPage(1);
            String pageText = pdfStripper.getText(document);

            // Закрытие документа
            //document.close();

            // Проверка наличия фразы "УЧЕБНЫЙ ПЛАН" в тексте
            return pageText.contains("УЧЕБНЫЙ ПЛАН");

        } catch (IOException e) {
            e.printStackTrace();
            return false;
        }
    }

    // парсинг первой страницы для поиска наименования направления, кода и тп
    public static String[] parsingTitlePage(PDDocument document) {
        String directionCode = "";
        String directionName = "";
        String directionProfile = "";
        String studyForm = "";
        String levelEducation = "";

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

            // Выводим полученные данные
            //System.out.println(directionCode + " " + directionName + " " + directionProfile + " " + studyForm + " " + levelEducation);

            document.close();

        } catch (IOException e) {
            e.printStackTrace();
        }
        // Возвращаем массив данных
        return new String[]{directionCode, directionName, directionProfile, studyForm, levelEducation};
    }

    // Метод для парсинга списка дисциплин и их кодов из документа PDF
    public static Map<String, String> parsingDisciplines(PDDocument document) {
        Map<String, String> disciplinesMap = new HashMap<>();

        try {
            // Получаем номер последней страницы
            int lastPage = document.getNumberOfPages();

            // Настроим PDFTextStripper для извлечения текста только с последней страницы
            PDFTextStripper textStripper = new PDFTextStripper();
            textStripper.setStartPage(lastPage);
            textStripper.setEndPage(lastPage);

            // Извлекаем текст с последней страницы
            String text = textStripper.getText(document);

            // Разбиваем текст на строки
            String[] lines = text.split("\n");

            String currentCode = "";
            StringBuilder currentName = new StringBuilder();

            // Обрабатываем каждую строку
            for (String line : lines) {
                line = line.trim();

                // Проверка на исключаемые строки
                if (isExcludedLine(line)) {
                    continue; // Пропускаем строки, которые не нужно обрабатывать
                }

                // Проверка, если нашли строку с "Элективные"
                if (line.startsWith("Элективные")) {
                    if (currentCode.length() > 0 || currentName.length() > 0) {
                        disciplinesMap.put(currentCode, currentName.toString().trim());
                    }
                    disciplinesMap.put("Элективные", "Элективные курсы по физической культуре и спорту");
                    currentCode = "";
                    currentName.setLength(0);
                    continue;
                }

                // Пытаемся найти код дисциплины
                String regex = "([А-ЯЁ]{1}\\d{1}\\.\\s?[А-ЯЁ]{1}[^\\s]*|ФТД\\.\\d+)"; // Формат: Код дисциплины или ФТД.цифра
                Pattern pattern = Pattern.compile(regex);
                Matcher matcher = pattern.matcher(line);

                // Если нашли новый код дисциплины
                if (matcher.find()) {
                    if (currentCode.length() > 0 || currentName.length() > 0) {
                        disciplinesMap.put(currentCode, currentName.toString().trim());
                    }
                    currentCode = matcher.group(1);
                    currentName = new StringBuilder();
                    currentName.append(line.substring(matcher.end()).trim());
                } else if (line.matches("^[а-яёa-z].*") && currentCode.length() > 0) {
                    // Добавляем продолжение названия
                    currentName.append(" ").append(line.trim());
                } else if (currentCode.length() > 0) {
                    // Если код уже найден, продолжаем добавлять текст
                    currentName.append(" ").append(line.trim());
                }
            }

            // Записываем последний найденный код и название
            if (currentCode.length() > 0 || currentName.length() > 0) {
                disciplinesMap.put(currentCode, currentName.toString().trim());
            }
            document.close();

        } catch (IOException e) {
            e.printStackTrace();
        }

        return disciplinesMap;
    }


    // Метод для проверки, является ли строка исключением
    private static boolean isExcludedLine(String line) {
        //List<String> excludedPatterns = getExcludedPatterns();

        for (String pattern : EXCLUDED_PATTERNS) {
            if (line.startsWith(pattern)) {
                return true; // Строка исключена
            }
        }
        return false; // Строка не исключена
    }
}