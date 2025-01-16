package com.company.parsing_wpd.view.discipline;

import com.company.parsing_wpd.entity.Discipline;
import com.company.parsing_wpd.view.main.MainView;
import com.vaadin.flow.router.Route;
import io.jmix.flowui.view.EditedEntityContainer;
import io.jmix.flowui.view.StandardDetailView;
import io.jmix.flowui.view.ViewController;
import io.jmix.flowui.view.ViewDescriptor;

@Route(value = "disciplines/:id", layout = MainView.class)
@ViewController("Discipline.detail")
@ViewDescriptor("discipline-detail-view.xml")
@EditedEntityContainer("disciplineDc")
public class DisciplineDetailView extends StandardDetailView<Discipline> {
}