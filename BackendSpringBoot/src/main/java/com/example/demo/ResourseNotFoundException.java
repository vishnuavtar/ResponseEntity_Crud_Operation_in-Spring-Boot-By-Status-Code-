package com.example.demo;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.NOT_FOUND)
public class ResourseNotFoundException extends RuntimeException {

	private static final long srrialVersionUID = 1l;
	
	public ResourseNotFoundException(String message) {
		super(message);
	}
	
}
