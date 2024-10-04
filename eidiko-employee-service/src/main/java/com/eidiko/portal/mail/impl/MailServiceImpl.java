package com.eidiko.portal.mail.impl;

import com.eidiko.portal.dto.employee.EmailDetailsDto;
import com.eidiko.portal.exception.employee.ResourceNotProcessedException;
import com.eidiko.portal.helper.employee.ConstantValues;
import com.eidiko.portal.mail.MailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class MailServiceImpl implements MailService {

	@Autowired
	private JavaMailSender javaMailSender;

	@Value("${spring.mail.username}")
	private String sender;

	private Logger logger = LoggerFactory.getLogger(getClass());

	@Override
	public boolean sendSimpleMail(EmailDetailsDto details) {
		try {
			// Creating a simple mail message
			MimeMessage message = javaMailSender.createMimeMessage();
			// Setting up necessary details

			message.setFrom(sender);
			message.setRecipients(MimeMessage.RecipientType.TO, details.getRecipient());
			message.setSubject(details.getSubject());

			message.setContent(details.getMsgBody(), "text/html; charset=utf-8");
			javaMailSender.send(message);
			this.logger.info("<<<<<<<<<<<<<<<<<<<" + ConstantValues.MAIL_SENT + ">>>>>>>>>>>>>>>>>>>>");
			return true;
		} catch (MessagingException | MailException e) {
			throw new ResourceNotProcessedException(e.getMessage());
		} 
		

	}

}
