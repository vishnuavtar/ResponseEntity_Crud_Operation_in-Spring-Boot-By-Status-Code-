package com.jdbc;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;

public class UpdateRecord {
	
	public static void main(String[] args) throws Exception {
		
		Class.forName("com.mysql.cj.jdbc.Driver");

		Connection con = DriverManager.getConnection("jdbc:mysql://localhost:3306/abc", "root", "root");

		String a = "update demo1 set id=? , name=? where id=?";
		
		
		BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
		
		
		System.out.println("ENter new id");
		
		int newid = Integer.parseInt(br.readLine());
		
		System.out.println("Enter name");
		
		String name = br.readLine();
		
	
		
		System.out.println("Enter id");
		int id = Integer.parseInt(br.readLine());
		
		PreparedStatement ps = con.prepareStatement(a);
		
		//ps.setString(1, "5");
		
//		ps.setString(1, "1");
//		ps.setString(1, "avtarvishnu");
		
		ps.setLong(1, id);
		ps.setString(2, name);
		
		ps.setInt(3, id);
		
		ps.executeUpdate();
		
		System.out.println("done");
		
		con.close();
		
		
		
	}

}
