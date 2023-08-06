package com.jdbc;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;


//working

public class GetAllREcord {
	
	public static void main(String[] args) throws Exception {
				
		Class.forName("com.mysql.cj.jdbc.Driver");

		Connection con = DriverManager.getConnection("jdbc:mysql://localhost:3306/abc", "root", "root");

		
		String str = "select * from student";
		
		PreparedStatement ps = con.prepareStatement(str);
		
		ResultSet i = ps.executeQuery();
		
		while(i.next()) {
			System.out.println(i.getInt("id"));
			System.out.println(i.getString("name"));
			System.out.println(i.getString("city"));
		}
		
		
		
		
	}

}
