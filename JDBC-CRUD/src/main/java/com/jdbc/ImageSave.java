package com.jdbc;

import java.io.FileInputStream;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;

// Working

public class ImageSave {

	public static void main(String[] args) throws Exception {

		Class.forName("com.mysql.cj.jdbc.Driver");

		Connection con = DriverManager.getConnection("jdbc:mysql://localhost:3306/abc", "root", "root");
		
		
		String str = "insert into images values(?)";
		
		PreparedStatement ps = con.prepareStatement(str);
		
		FileInputStream fis = new FileInputStream("12.png");
		
		ps.setBinaryStream(1, fis, fis.available());
		
		ps.execute();
		
		System.out.println("Done");
	}

}
