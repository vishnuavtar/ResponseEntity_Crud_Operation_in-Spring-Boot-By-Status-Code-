package com.jdbc;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.Statement;

public class InsertData {

	public static void main(String[] args) throws Exception {

		Class.forName("com.mysql.cj.jdbc.Driver");

		Connection con = DriverManager.getConnection("jdbc:mysql://localhost:3306/abc", "root", "root");

		String str = "insert into demo1(id , name) values(?,?)";

		PreparedStatement ps = con.prepareStatement(str);
		
		
		
		ps.setString(1, "2");
		ps.setString(2, "Vishnu");

		ps.execute();

		System.out.println("inserted");

		con.close();

	}

}
