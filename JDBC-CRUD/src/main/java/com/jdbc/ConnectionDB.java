package com.jdbc;

import java.sql.Connection;
import java.sql.DriverManager;

public class ConnectionDB {
	
	public static void main(String[] args) throws Exception {
		
		
		Class.forName("com.mysql.cj.jdbc.Driver");
		
		Connection con = DriverManager.getConnection("jdbc:mysql://localhost:3306/abc" ,"root","root");
		
		if(con.isClosed()) {
			System.out.println("Connection is closed");
		}else {
			System.out.println("Connection Open");
		}
	}

}
