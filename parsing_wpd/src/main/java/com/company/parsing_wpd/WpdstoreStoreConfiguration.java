package com.company.parsing_wpd;

import io.jmix.autoconfigure.data.JmixLiquibaseCreator;
import liquibase.integration.spring.SpringLiquibase;
import org.springframework.boot.autoconfigure.liquibase.LiquibaseProperties;
import io.jmix.core.JmixModules;
import io.jmix.core.Resources;
import io.jmix.data.impl.JmixEntityManagerFactoryBean;
import io.jmix.data.impl.JmixTransactionManager;
import io.jmix.data.persistence.DbmsSpecifics;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.JpaVendorAdapter;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;

import jakarta.persistence.EntityManagerFactory;

import javax.sql.DataSource;

@Configuration
public class WpdstoreStoreConfiguration {

    @Bean
    @ConfigurationProperties("wpdstore.datasource")
    DataSourceProperties wpdstoreDataSourceProperties() {
        return new DataSourceProperties();
    }

    @Bean
    @ConfigurationProperties(prefix = "wpdstore.datasource.hikari")
    DataSource wpdstoreDataSource(@Qualifier("wpdstoreDataSourceProperties") DataSourceProperties properties) {
        return properties.initializeDataSourceBuilder().build();
    }

    @Bean
    LocalContainerEntityManagerFactoryBean wpdstoreEntityManagerFactory(
            @Qualifier("wpdstoreDataSource") DataSource dataSource,
            JpaVendorAdapter jpaVendorAdapter,
            DbmsSpecifics dbmsSpecifics,
            JmixModules jmixModules,
            Resources resources
    ) {
        return new JmixEntityManagerFactoryBean("wpdstore", dataSource, jpaVendorAdapter, dbmsSpecifics, jmixModules, resources);
    }

    @Bean
    JpaTransactionManager wpdstoreTransactionManager(@Qualifier("wpdstoreEntityManagerFactory") EntityManagerFactory entityManagerFactory) {
        return new JmixTransactionManager("wpdstore", entityManagerFactory);
    }

    @Bean("wpdstoreLiquibaseProperties")
    @ConfigurationProperties(prefix = "wpdstore.liquibase")
    public LiquibaseProperties wpdstoreLiquibaseProperties() {
        return new LiquibaseProperties();
    }

    @Bean("wpdstoreLiquibase")
    public SpringLiquibase wpdstoreLiquibase(@Qualifier("wpdstoreDataSource") DataSource dataSource,
                                             @Qualifier("wpdstoreLiquibaseProperties") LiquibaseProperties liquibaseProperties) {
        return JmixLiquibaseCreator.create(dataSource, liquibaseProperties);
    }
}
