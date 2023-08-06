package com.jdbc;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.util.Scanner;

// working

public class UpdateRecordData {
	
	public static void main(String[] args) throws Exception {
		
		
		Class.forName("com.mysql.cj.jdbc.Driver");

		Connection con = DriverManager.getConnection("jdbc:mysql://localhost:3306/abc", "root", "root");

		
		String str = "update demo1 set name=? where id=?";
		
		Scanner sc = new Scanner(System.in);
		
		System.out.println("Enter name");
		
		String s = sc.nextLine();
		
		System.out.println("Enter id");
		
		int a = sc.nextInt();
		
		PreparedStatement ps = con.prepareStatement(str);
		
		ps.setString(1, s);
		
		ps.setLong(2, a);
		
		ps.execute();
		
		System.out.println("done");
		
		con.close();
	}

}
