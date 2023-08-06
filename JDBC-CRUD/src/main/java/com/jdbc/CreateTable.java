package com.jdbc;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.Statement;

public class CreateTable {

	public static void main(String[] args)  throws Exception {

		Class.forName("com.mysql.cj.jdbc.Driver");

		Connection con = DriverManager.getConnection("jdbc:mysql://localhost:3306/abc", "root", "root");

		
		String str = ("create table demo1(id int primary key, name varchar(200))");
		
		Statement st = con.createStatement();
		
		st.executeUpdate(str);
		
		System.out.println("Table created");
		
	}

}
