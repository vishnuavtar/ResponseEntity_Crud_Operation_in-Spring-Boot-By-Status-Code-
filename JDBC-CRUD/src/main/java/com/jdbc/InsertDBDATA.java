package com.jdbc;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;


//working

public class InsertDBDATA {

	public static void main(String[] args) throws Exception {

		Class.forName("com.mysql.cj.jdbc.Driver");

		Connection con = DriverManager.getConnection("jdbc:mysql://localhost:3306/abc", "root", "root");

		//String str = "insert into student values(10,'Anudip','Bangalore')";
		
		String str = "insert into student values(?,?,?)"; 

		PreparedStatement ps = con.prepareStatement(str);
		
		ps.setString(1, "1");
		ps.setString(2, "Anudip");
		ps.setString(3, "Bangalore");

		ps.execute();

		System.out.println("Record Inserted");

	}

}
