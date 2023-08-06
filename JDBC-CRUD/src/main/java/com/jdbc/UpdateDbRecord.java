package com.jdbc;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.util.Scanner;


//working

public class UpdateDbRecord {

	public static void main(String[] args) throws Exception {

		Class.forName("com.mysql.cj.jdbc.Driver");

		Connection con = DriverManager.getConnection("jdbc:mysql://localhost:3306/abc", "root", "root");

		String str = "update student set name=?, city=? where id=?";

		Scanner sc = new Scanner(System.in);

		System.out.println("Enter name");

		String name1 = sc.nextLine();

		System.out.println("Enter city ");

		String city1 = sc.nextLine();

		System.out.println("Enter id");

		int id1 = sc.nextInt();

		PreparedStatement ps = con.prepareStatement(str);

		ps.setString(1, name1);
		ps.setString(2, city1);

		ps.setInt(3, id1);
		
		ps.execute();

		System.out.println("update done");

		con.close();

	}

}
