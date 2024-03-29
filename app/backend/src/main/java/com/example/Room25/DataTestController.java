package com.example.Room25;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class DataTestController {

    @GetMapping("/test")
    public String testData() {
        return "Hello from backend!";
    }
}
