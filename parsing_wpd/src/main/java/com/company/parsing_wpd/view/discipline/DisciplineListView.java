package com.company.parsing_wpd.view.discipline;

import com.company.parsing_wpd.entity.Discipline;
import com.company.parsing_wpd.view.main.MainView;
import com.vaadin.flow.router.Route;
import io.jmix.flowui.view.*;


@Route(value = "disciplines", layout = MainView.class)
@ViewController("Discipline.list")
@ViewDescriptor("discipline-list-view.xml")
@LookupComponent("disciplinesDataGrid")
@DialogMode(width = "64em")
public class DisciplineListView extends StandardListView<Discipline> {
}