package com.product.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;


@Entity
@Table(name = "product")
public class product {
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long pid;
	
	@Column(name = "product_name")
	private String productName;
	
	@Column(name = "product_price")
	private String productPrice;
	
	@Column(name = "for_product")
	private String forProduct;
	
	@Column(name = "product_description")
	private String productDescription;

	
	public product() {
		super();
	}

	public product(Long pid, String productName, String productPrice, String forProduct, String productDescription) {
		super();
		this.pid = pid;
		this.productName = productName;
		this.productPrice = productPrice;
		this.forProduct = forProduct;
		this.productDescription = productDescription;
	}

	@Override
	public String toString() {
		return "product [pid=" + pid + ", productName=" + productName + ", productPrice=" + productPrice
				+ ", forProduct=" + forProduct + ", productDescription=" + productDescription + "]";
	}

	public Long getPid() {
		return pid;
	}

	public void setPid(Long pid) {
		this.pid = pid;
	}

	public String getProductName() {
		return productName;
	}

	public void setProductName(String productName) {
		this.productName = productName;
	}

	public String getProductPrice() {
		return productPrice;
	}

	public void setProductPrice(String productPrice) {
		this.productPrice = productPrice;
	}

	public String getForProduct() {
		return forProduct;
	}

	public void setForProduct(String forProduct) {
		this.forProduct = forProduct;
	}

	public String getProductDescription() {
		return productDescription;
	}

	public void setProductDescription(String productDescription) {
		this.productDescription = productDescription;
	}

	
}
