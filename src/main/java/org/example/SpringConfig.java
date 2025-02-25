package org.example;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@ComponentScan
public class SpringConfig implements WebMvcConfigurer {
    @Getter
    private static ApplicationContext context;

    @Autowired
    public SpringConfig(ApplicationContext applicationContext) {
        context = applicationContext;
    }
}
