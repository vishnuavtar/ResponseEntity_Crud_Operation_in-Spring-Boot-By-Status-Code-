package com.jdbc;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

//working

public class GetRecord {

	
	public static void main(String[] args) throws Exception{
		
		
		Class.forName("com.mysql.cj.jdbc.Driver");

		Connection con = DriverManager.getConnection("jdbc:mysql://localhost:3306/abc", "root", "root");

		String str = "select * from demo1";
		
		
		PreparedStatement st = con.prepareStatement(str);
		
	
		ResultSet rs = st.executeQuery();
		
		while(rs.next()) {
			System.out.println(rs.getString("id") + " = " + rs.getString("name"));
			
		}
		
		
		
	}
}
