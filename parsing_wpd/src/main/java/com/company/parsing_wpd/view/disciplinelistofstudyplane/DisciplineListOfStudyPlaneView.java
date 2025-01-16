package com.company.parsing_wpd.view.disciplinelistofstudyplane;

import com.company.parsing_wpd.view.main.MainView;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.router.Route;
import io.jmix.flowui.fragment.Fragment;
import io.jmix.flowui.fragment.FragmentDescriptor;

@Route(value = "study-planes/:id", layout = MainView.class)
@FragmentDescriptor("discipline-list-of-study-plane-view.xml")
public class DisciplineListOfStudyPlaneView extends Fragment<VerticalLayout> {
}