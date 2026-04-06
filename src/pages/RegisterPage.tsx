import React, { useState } from 'react';
import { Eye, EyeOff, ArrowLeft, Mail, Lock, User, Phone, Car, AlertCircle, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
  sendEmailVerification,
} from 'firebase/auth';
import { auth, googleProvider, db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import logo from "../assets/logo.png";

interface RegisterForm {
  name: string;
  email: string;
  countryCode: string;
  phone: string;
  password: string;
  confirmPassword: string;
  vehiclePlate: string;
}

// Per-field error map — keys match RegisterForm fields + 'terms' + 'form'
type FieldErrors = Partial<Record<keyof RegisterForm | 'terms' | 'form', string>>;

const COUNTRY_CODES = [
  { code: '+93', flag: '🇦🇫', name: 'Afghanistan (افغانستان)', digits: 9 },
  { code: '+355', flag: '🇦🇱', name: 'Albania (Shqipëria)', digits: 9 },
  { code: '+213', flag: '🇩🇿', name: 'Algeria (الجزائر)', digits: 9 },
  { code: '+1-684', flag: '🇦🇸', name: 'American Samoa', digits: 7 },
  { code: '+376', flag: '🇦🇩', name: 'Andorra', digits: 6 },
  { code: '+244', flag: '🇦🇴', name: 'Angola', digits: 9 },
  { code: '+1-264', flag: '🇦🇮', name: 'Anguilla', digits: 7 },
  { code: '+1-268', flag: '🇦🇬', name: 'Antigua and Barbuda', digits: 7 },
  { code: '+54', flag: '🇦🇷', name: 'Argentina', digits: 10 },
  { code: '+374', flag: '🇦🇲', name: 'Armenia (Հայաստան)', digits: 8 },
  { code: '+297', flag: '🇦🇼', name: 'Aruba', digits: 7 },
  { code: '+61', flag: '🇦🇺', name: 'Australia', digits: 9 },
  { code: '+43', flag: '🇦🇹', name: 'Austria (Österreich)', digits: 10 },
  { code: '+994', flag: '🇦🇿', name: 'Azerbaijan (Azərbaycan)', digits: 9 },
  { code: '+1-242', flag: '🇧🇸', name: 'Bahamas', digits: 7 },
  { code: '+973', flag: '🇧🇭', name: 'Bahrain (البحرين)', digits: 8 },
  { code: '+880', flag: '🇧🇩', name: 'Bangladesh (বাংলাদেশ)', digits: 10 },
  { code: '+1-246', flag: '🇧🇧', name: 'Barbados', digits: 7 },
  { code: '+375', flag: '🇧🇾', name: 'Belarus (Беларусь)', digits: 9 },
  { code: '+32', flag: '🇧🇪', name: 'Belgium (België)', digits: 9 },
  { code: '+501', flag: '🇧🇿', name: 'Belize', digits: 7 },
  { code: '+229', flag: '🇧🇯', name: 'Benin (Bénin)', digits: 8 },
  { code: '+1-441', flag: '🇧🇲', name: 'Bermuda', digits: 7 },
  { code: '+975', flag: '🇧🇹', name: 'Bhutan (འབྲུག་ཡུལ་)', digits: 8 },
  { code: '+591', flag: '🇧🇴', name: 'Bolivia', digits: 8 },
  { code: '+387', flag: '🇧🇦', name: 'Bosnia and Herzegovina', digits: 8 },
  { code: '+267', flag: '🇧🇼', name: 'Botswana', digits: 8 },
  { code: '+55', flag: '🇧🇷', name: 'Brazil (Brasil)', digits: 11 },
  { code: '+1-284', flag: '🇻🇬', name: 'British Virgin Islands', digits: 7 },
  { code: '+673', flag: '🇧🇳', name: 'Brunei', digits: 7 },
  { code: '+359', flag: '🇧🇬', name: 'Bulgaria (България)', digits: 9 },
  { code: '+226', flag: '🇧🇫', name: 'Burkina Faso', digits: 8 },
  { code: '+257', flag: '🇧🇮', name: 'Burundi (Uburundi)', digits: 8 },
  { code: '+855', flag: '🇰🇭', name: 'Cambodia (កម្ពុជា)', digits: 9 },
  { code: '+237', flag: '🇨🇲', name: 'Cameroon (Cameroun)', digits: 9 },
  { code: '+1', flag: '🇨🇦', name: 'Canada', digits: 10 },
  { code: '+238', flag: '🇨🇻', name: 'Cape Verde (Cabo Verde)', digits: 7 },
  { code: '+1-345', flag: '🇰🇾', name: 'Cayman Islands', digits: 7 },
  { code: '+236', flag: '🇨🇫', name: 'Central African Republic', digits: 8 },
  { code: '+235', flag: '🇹🇩', name: 'Chad (Tchad)', digits: 8 },
  { code: '+56', flag: '🇨🇱', name: 'Chile', digits: 9 },
  { code: '+86', flag: '🇨🇳', name: 'China (中国)', digits: 11 },
  { code: '+57', flag: '🇨🇴', name: 'Colombia', digits: 10 },
  { code: '+269', flag: '🇰🇲', name: 'Comoros (جزر القمر)', digits: 7 },
  { code: '+242', flag: '🇨🇬', name: 'Congo - Brazzaville', digits: 9 },
  { code: '+243', flag: '🇨🇩', name: 'Congo - Kinshasa', digits: 9 },
  { code: '+682', flag: '🇨🇰', name: 'Cook Islands', digits: 5 },
  { code: '+506', flag: '🇨🇷', name: 'Costa Rica', digits: 8 },
  { code: '+385', flag: '🇭🇷', name: 'Croatia (Hrvatska)', digits: 9 },
  { code: '+53', flag: '🇨🇺', name: 'Cuba', digits: 8 },
  { code: '+599', flag: '🇨🇼', name: 'Curaçao', digits: 7 },
  { code: '+357', flag: '🇨🇾', name: 'Cyprus (Κύπρος)', digits: 8 },
  { code: '+420', flag: '🇨🇿', name: 'Czechia (Česko)', digits: 9 },
  { code: '+45', flag: '🇩🇰', name: 'Denmark (Danmark)', digits: 8 },
  { code: '+253', flag: '🇩🇯', name: 'Djibouti', digits: 6 },
  { code: '+1-767', flag: '🇩🇲', name: 'Dominica', digits: 7 },
  { code: '+1-809', flag: '🇩🇴', name: 'Dominican Republic', digits: 7 },
  { code: '+593', flag: '🇪🇨', name: 'Ecuador', digits: 9 },
  { code: '+20', flag: '🇪🇬', name: 'Egypt (مصر)', digits: 10 },
  { code: '+503', flag: '🇸🇻', name: 'El Salvador', digits: 8 },
  { code: '+240', flag: '🇬🇶', name: 'Equatorial Guinea', digits: 9 },
  { code: '+291', flag: '🇪🇷', name: 'Eritrea', digits: 7 },
  { code: '+372', flag: '🇪🇪', name: 'Estonia (Eesti)', digits: 8 },
  { code: '+268', flag: '🇸🇿', name: 'Eswatini', digits: 8 },
  { code: '+251', flag: '🇪🇹', name: 'Ethiopia', digits: 9 },
  { code: '+500', flag: '🇫🇰', name: 'Falkland Islands', digits: 5 },
  { code: '+298', flag: '🇫🇴', name: 'Faroe Islands (Føroyar)', digits: 5 },
  { code: '+679', flag: '🇫🇯', name: 'Fiji', digits: 7 },
  { code: '+358', flag: '🇫🇮', name: 'Finland (Suomi)', digits: 10 },
  { code: '+33', flag: '🇫🇷', name: 'France', digits: 9 },
  { code: '+594', flag: '🇬🇫', name: 'French Guiana', digits: 9 },
  { code: '+689', flag: '🇵🇫', name: 'French Polynesia', digits: 6 },
  { code: '+241', flag: '🇬🇦', name: 'Gabon', digits: 7 },
  { code: '+220', flag: '🇬🇲', name: 'Gambia', digits: 7 },
  { code: '+995', flag: '🇬🇪', name: 'Georgia (საქართველო)', digits: 9 },
  { code: '+49', flag: '🇩🇪', name: 'Germany (Deutschland)', digits: 11 },
  { code: '+233', flag: '🇬🇭', name: 'Ghana (Gaana)', digits: 9 },
  { code: '+350', flag: '🇬🇮', name: 'Gibraltar', digits: 8 },
  { code: '+30', flag: '🇬🇷', name: 'Greece (Ελλάδα)', digits: 10 },
  { code: '+299', flag: '🇬🇱', name: 'Greenland', digits: 6 },
  { code: '+1-473', flag: '🇬🇩', name: 'Grenada', digits: 7 },
  { code: '+590', flag: '🇬🇵', name: 'Guadeloupe', digits: 9 },
  { code: '+1-671', flag: '🇬🇺', name: 'Guam', digits: 7 },
  { code: '+502', flag: '🇬🇹', name: 'Guatemala', digits: 8 },
  { code: '+224', flag: '🇬🇳', name: 'Guinea (Guinée)', digits: 8 },
  { code: '+245', flag: '🇬🇼', name: 'Guinea-Bissau', digits: 7 },
  { code: '+592', flag: '🇬🇾', name: 'Guyana', digits: 7 },
  { code: '+509', flag: '🇭🇹', name: 'Haiti', digits: 8 },
  { code: '+504', flag: '🇭🇳', name: 'Honduras', digits: 8 },
  { code: '+852', flag: '🇭🇰', name: 'Hong Kong (香港)', digits: 8 },
  { code: '+36', flag: '🇭🇺', name: 'Hungary (Magyarország)', digits: 9 },
  { code: '+354', flag: '🇮🇸', name: 'Iceland (Ísland)', digits: 7 },
  { code: '+91', flag: '🇮🇳', name: 'India (भारत)', digits: 10 },
  { code: '+62', flag: '🇮🇩', name: 'Indonesia', digits: 11 },
  { code: '+98', flag: '🇮🇷', name: 'Iran (ایران)', digits: 10 },
  { code: '+964', flag: '🇮🇶', name: 'Iraq (العراق)', digits: 10 },
  { code: '+353', flag: '🇮🇪', name: 'Ireland (Éire)', digits: 9 },
  { code: '+972', flag: '🇮🇱', name: 'Israel (ישראל)', digits: 9 },
  { code: '+39', flag: '🇮🇹', name: 'Italy (Italia)', digits: 10 },
  { code: '+1-876', flag: '🇯🇲', name: 'Jamaica', digits: 7 },
  { code: '+81', flag: '🇯🇵', name: 'Japan (日本)', digits: 10 },
  { code: '+962', flag: '🇯🇴', name: 'Jordan (الأردن)', digits: 9 },
  { code: '+7', flag: '🇰🇿', name: 'Kazakhstan (Казахстан)', digits: 10 },
  { code: '+254', flag: '🇰🇪', name: 'Kenya', digits: 9 },
  { code: '+686', flag: '🇰🇮', name: 'Kiribati', digits: 8 },
  { code: '+850', flag: '🇰🇵', name: 'North Korea', digits: 10 },
  { code: '+82', flag: '🇰🇷', name: 'South Korea (대한민국)', digits: 10 },
  { code: '+965', flag: '🇰🇼', name: 'Kuwait (الكويت)', digits: 8 },
  { code: '+996', flag: '🇰🇬', name: 'Kyrgyzstan', digits: 9 },
  { code: '+856', flag: '🇱🇦', name: 'Laos (ລາວ)', digits: 10 },
  { code: '+371', flag: '🇱🇻', name: 'Latvia (Latvija)', digits: 8 },
  { code: '+961', flag: '🇱🇧', name: 'Lebanon (لبنان)', digits: 8 },
  { code: '+266', flag: '🇱🇸', name: 'Lesotho', digits: 8 },
  { code: '+231', flag: '🇱🇷', name: 'Liberia', digits: 7 },
  { code: '+218', flag: '🇱🇾', name: 'Libya (ليبيا)', digits: 9 },
  { code: '+423', flag: '🇱🇮', name: 'Liechtenstein', digits: 7 },
  { code: '+370', flag: '🇱🇹', name: 'Lithuania (Lietuva)', digits: 8 },
  { code: '+352', flag: '🇱🇺', name: 'Luxembourg', digits: 9 },
  { code: '+853', flag: '🇲🇴', name: 'Macau (澳門)', digits: 8 },
  { code: '+389', flag: '🇲🇰', name: 'North Macedonia', digits: 8 },
  { code: '+261', flag: '🇲🇬', name: 'Madagascar', digits: 9 },
  { code: '+265', flag: '🇲🇼', name: 'Malawi', digits: 9 },
  { code: '+60', flag: '🇲🇾', name: 'Malaysia', digits: 9 },
  { code: '+960', flag: '🇲🇻', name: 'Maldives', digits: 7 },
  { code: '+223', flag: '🇲🇱', name: 'Mali', digits: 8 },
  { code: '+356', flag: '🇲🇹', name: 'Malta', digits: 8 },
  { code: '+692', flag: '🇲🇭', name: 'Marshall Islands', digits: 7 },
  { code: '+596', flag: '🇲🇶', name: 'Martinique', digits: 9 },
  { code: '+222', flag: '🇲🇷', name: 'Mauritania', digits: 8 },
  { code: '+230', flag: '🇲🇺', name: 'Mauritius (Maurice)', digits: 7 },
  { code: '+52', flag: '🇲🇽', name: 'Mexico (México)', digits: 10 },
  { code: '+691', flag: '🇫🇲', name: 'Micronesia', digits: 7 },
  { code: '+373', flag: '🇲🇩', name: 'Moldova', digits: 8 },
  { code: '+377', flag: '🇲🇨', name: 'Monaco', digits: 8 },
  { code: '+976', flag: '🇲🇳', name: 'Mongolia (Монгол)', digits: 8 },
  { code: '+382', flag: '🇲🇪', name: 'Montenegro', digits: 8 },
  { code: '+1-664', flag: '🇲🇸', name: 'Montserrat', digits: 7 },
  { code: '+212', flag: '🇲🇦', name: 'Morocco (المغرب)', digits: 9 },
  { code: '+258', flag: '🇲🇿', name: 'Mozambique', digits: 9 },
  { code: '+95', flag: '🇲🇲', name: 'Myanmar (Burma)', digits: 9 },
  { code: '+264', flag: '🇳🇦', name: 'Namibia', digits: 9 },
  { code: '+674', flag: '🇳🇷', name: 'Nauru', digits: 7 },
  { code: '+977', flag: '🇳🇵', name: 'Nepal (नेपाल)', digits: 10 },
  { code: '+31', flag: '🇳🇱', name: 'Netherlands (Nederland)', digits: 9 },
  { code: '+687', flag: '🇳🇨', name: 'New Caledonia', digits: 6 },
  { code: '+64', flag: '🇳🇿', name: 'New Zealand', digits: 9 },
  { code: '+505', flag: '🇳🇮', name: 'Nicaragua', digits: 8 },
  { code: '+227', flag: '🇳🇪', name: 'Niger (Nijar)', digits: 8 },
  { code: '+234', flag: '🇳🇬', name: 'Nigeria', digits: 10 },
  { code: '+683', flag: '🇳🇺', name: 'Niue', digits: 4 },
  { code: '+1-670', flag: '🇲🇵', name: 'Northern Mariana Islands', digits: 7 },
  { code: '+47', flag: '🇳🇴', name: 'Norway (Norge)', digits: 8 },
  { code: '+968', flag: '🇴🇲', name: 'Oman (عُمان)', digits: 8 },
  { code: '+92', flag: '🇵🇰', name: 'Pakistan (پاکستان)', digits: 10 },
  { code: '+680', flag: '🇵🇼', name: 'Palau', digits: 7 },
  { code: '+970', flag: '🇵🇸', name: 'Palestine (فلسطين)', digits: 9 },
  { code: '+507', flag: '🇵🇦', name: 'Panama (Panamá)', digits: 8 },
  { code: '+675', flag: '🇵🇬', name: 'Papua New Guinea', digits: 8 },
  { code: '+595', flag: '🇵🇾', name: 'Paraguay', digits: 9 },
  { code: '+51', flag: '🇵🇪', name: 'Peru (Perú)', digits: 9 },
  { code: '+63', flag: '🇵🇭', name: 'Philippines', digits: 10 },
  { code: '+48', flag: '🇵🇱', name: 'Poland (Polska)', digits: 9 },
  { code: '+351', flag: '🇵🇹', name: 'Portugal', digits: 9 },
  { code: '+1-787', flag: '🇵🇷', name: 'Puerto Rico', digits: 7 },
  { code: '+974', flag: '🇶🇦', name: 'Qatar (قطر)', digits: 8 },
  { code: '+40', flag: '🇷🇴', name: 'Romania (România)', digits: 9 },
  { code: '+7', flag: '🇷🇺', name: 'Russia (Россия)', digits: 10 },
  { code: '+250', flag: '🇷🇼', name: 'Rwanda', digits: 9 },
  { code: '+290', flag: '🇸🇭', name: 'Saint Helena', digits: 4 },
  { code: '+1-869', flag: '🇰🇳', name: 'Saint Kitts and Nevis', digits: 7 },
  { code: '+1-758', flag: '🇱🇨', name: 'Saint Lucia', digits: 7 },
  { code: '+508', flag: '🇵🇲', name: 'Saint Pierre and Miquelon', digits: 6 },
  { code: '+1-784', flag: '🇻🇨', name: 'Saint Vincent and the Grenadines', digits: 7 },
  { code: '+685', flag: '🇼🇸', name: 'Samoa', digits: 7 },
  { code: '+378', flag: '🇸🇲', name: 'San Marino', digits: 10 },
  { code: '+239', flag: '🇸🇹', name: 'São Tomé and Príncipe', digits: 7 },
  { code: '+966', flag: '🇸🇦', name: 'Saudi Arabia', digits: 9 },
  { code: '+221', flag: '🇸🇳', name: 'Senegal (Sénégal)', digits: 9 },
  { code: '+381', flag: '🇷🇸', name: 'Serbia (Србија)', digits: 9 },
  { code: '+248', flag: '🇸🇨', name: 'Seychelles', digits: 7 },
  { code: '+232', flag: '🇸🇱', name: 'Sierra Leone', digits: 8 },
  { code: '+65', flag: '🇸🇬', name: 'Singapore', digits: 8 },
  { code: '+421', flag: '🇸🇰', name: 'Slovakia (Slovensko)', digits: 9 },
  { code: '+386', flag: '🇸🇮', name: 'Slovenia (Slovenija)', digits: 8 },
  { code: '+677', flag: '🇸🇧', name: 'Solomon Islands', digits: 5 },
  { code: '+252', flag: '🇸🇴', name: 'Somalia (Soomaaliya)', digits: 8 },
  { code: '+27', flag: '🇿🇦', name: 'South Africa', digits: 9 },
  { code: '+211', flag: '🇸🇸', name: 'South Sudan', digits: 9 },
  { code: '+34', flag: '🇪🇸', name: 'Spain (España)', digits: 9 },
  { code: '+94', flag: '🇱🇰', name: 'Sri Lanka (ශ්‍රී ලංකාව)', digits: 9 },
  { code: '+249', flag: '🇸🇩', name: 'Sudan (السودان)', digits: 9 },
  { code: '+597', flag: '🇸🇷', name: 'Suriname', digits: 7 },
  { code: '+46', flag: '🇸🇪', name: 'Sweden (Sverige)', digits: 9 },
  { code: '+41', flag: '🇨🇭', name: 'Switzerland (Schweiz)', digits: 9 },
  { code: '+963', flag: '🇸🇾', name: 'Syria (سوريا)', digits: 10 },
  { code: '+886', flag: '🇹🇼', name: 'Taiwan (台灣)', digits: 9 },
  { code: '+992', flag: '🇹🇯', name: 'Tajikistan', digits: 9 },
  { code: '+255', flag: '🇹🇿', name: 'Tanzania', digits: 9 },
  { code: '+66', flag: '🇹🇭', name: 'Thailand (ไทย)', digits: 9 },
  { code: '+228', flag: '🇹🇬', name: 'Togo', digits: 8 },
  { code: '+690', flag: '🇹🇰', name: 'Tokelau', digits: 4 },
  { code: '+676', flag: '🇹🇴', name: 'Tonga', digits: 7 },
  { code: '+1-868', flag: '🇹🇹', name: 'Trinidad and Tobago', digits: 7 },
  { code: '+216', flag: '🇹🇳', name: 'Tunisia (تونس)', digits: 8 },
  { code: '+90', flag: '🇹🇷', name: 'Turkey (Türkiye)', digits: 10 },
  { code: '+993', flag: '🇹🇲', name: 'Turkmenistan', digits: 8 },
  { code: '+1-649', flag: '🇹🇨', name: 'Turks and Caicos Islands', digits: 7 },
  { code: '+688', flag: '🇹🇻', name: 'Tuvalu', digits: 5 },
  { code: '+256', flag: '🇺🇬', name: 'Uganda', digits: 9 },
  { code: '+380', flag: '🇺🇦', name: 'Ukraine (Україна)', digits: 9 },
  { code: '+971', flag: '🇦🇪', name: 'United Arab Emirates', digits: 9 },
  { code: '+44', flag: '🇬🇧', name: 'United Kingdom', digits: 10 },
  { code: '+1', flag: '🇺🇸', name: 'United States', digits: 10 },
  { code: '+598', flag: '🇺🇾', name: 'Uruguay', digits: 9 },
  { code: '+998', flag: '🇺🇿', name: 'Uzbekistan', digits: 9 },
  { code: '+678', flag: '🇻🇺', name: 'Vanuatu', digits: 7 },
  { code: '+39', flag: '🇻🇦', name: 'Vatican City', digits: 10 },
  { code: '+58', flag: '🇻🇪', name: 'Venezuela', digits: 10 },
  { code: '+84', flag: '🇻🇳', name: 'Vietnam (Việt Nam)', digits: 9 },
  { code: '+1-340', flag: '🇻🇮', name: 'U.S. Virgin Islands', digits: 7 },
  { code: '+681', flag: '🇼🇫', name: 'Wallis and Futuna', digits: 6 },
  { code: '+967', flag: '🇾🇪', name: 'Yemen (اليمن)', digits: 9 },
  { code: '+260', flag: '🇿🇲', name: 'Zambia', digits: 9 },
  { code: '+263', flag: '🇿🇼', name: 'Zimbabwe', digits: 9 },
];

const passwordStrength = (pwd: string) => {
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  return score;
};

const strengthLabel = ['Too short', 'Weak', 'Fair', 'Good', 'Strong'];
const strengthColor = ['bg-neutral-700', 'bg-red-500', 'bg-orange-400', 'bg-yellow-400', 'bg-green-500'];

const SL_PLATE_PATTERNS: RegExp[] = [
  /^[A-Z]{2,3}\s[A-Z]{3}-\d{4}$/,
  /^[A-Z]{2,3}\s[A-Z]{2}-\d{4}$/,
  /^\d{2}-\d{4}$/,
  /^\d{1,2}\sශ්‍රී\s\d{4}$/,
];

const validateSLPlate = (value: string): boolean => {
  if (!value.trim()) return true;
  return SL_PLATE_PATTERNS.some(p => p.test(value.trim()));
};

const formatPlate = (raw: string): { formatted: string; maxLength: number } => {
  if (/ශ/.test(raw)) return { formatted: raw, maxLength: 9 };
  const up = raw.toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (/^\d/.test(up)) {
    const digits = up.replace(/\D/g, '');
    const formatted = digits.length > 2 ? `${digits.slice(0, 2)}-${digits.slice(2, 6)}` : digits;
    return { formatted, maxLength: 7 };
  }
  const letters = up.replace(/\d/g, '');
  const digits  = up.replace(/\D/g, '');
  if (letters.length <= 2) {
    const province = letters.slice(0, 2);
    if (up.length <= 2) return { formatted: province, maxLength: 10 };
    if (digits.length === 0) return { formatted: province, maxLength: 10 };
    return { formatted: `${province} ${letters.slice(2)}-${digits.slice(0,4)}`.replace(/\s$/, ''), maxLength: 10 };
  }
  const province = letters.slice(0, 2);
  const series   = letters.slice(2, 5);
  const is3Letter = letters.length >= 5 || (letters.length === 4 && digits.length > 0);
  if (series.length === 0) return { formatted: province, maxLength: 11 };
  const formatted = digits.length > 0 ? `${province} ${series}-${digits.slice(0, 4)}` : `${province} ${series}`;
  return { formatted, maxLength: is3Letter ? 11 : 10 };
};

// ── Reusable inline field-error component ─────────────────────────────────────
function FieldError({ message }: { message?: string }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.p
          initial={{ opacity: 0, y: -4, height: 0 }}
          animate={{ opacity: 1, y: 0, height: 'auto' }}
          exit={{ opacity: 0, y: -4, height: 0 }}
          transition={{ duration: 0.18 }}
          className="flex items-center gap-1.5 text-xs text-red-400 mt-1.5 overflow-hidden"
        >
          <AlertCircle className="w-3 h-3 flex-shrink-0" />
          {message}
        </motion.p>
      )}
    </AnimatePresence>
  );
}

export function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<RegisterForm>({
    name: '', email: '', countryCode: '+94', phone: '', password: '', confirmPassword: '', vehiclePlate: '',
  });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [showCountryDrop, setShowCountryDrop] = useState(false);
  const selectedCountry = COUNTRY_CODES.find(c => c.code === form.countryCode) || COUNTRY_CODES[0];
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [registeredName, setRegisteredName] = useState('');

  const pwdScore = passwordStrength(form.password);
  const plateValid = validateSLPlate(form.vehiclePlate);
  const { maxLength: plateMaxLength } = formatPlate(form.vehiclePlate || '');
  const phoneDigits = form.phone.replace(/\D/g, '');
  const phoneValid = phoneDigits.length === selectedCountry.digits;

  // Clear a field's error as soon as the user edits it
  const clearErr = (key: keyof FieldErrors) =>
    setFieldErrors(prev => ({ ...prev, [key]: undefined }));

  const getFriendlyFirebaseError = (code: string): { field: keyof FieldErrors; msg: string } => {
    const map: Record<string, { field: keyof FieldErrors; msg: string }> = {
      'auth/email-already-in-use':  { field: 'email',    msg: 'An account already exists with this email.' },
      'auth/invalid-email':          { field: 'email',    msg: 'Please enter a valid email address.' },
      'auth/weak-password':          { field: 'password', msg: 'Password should be at least 6 characters.' },
      'auth/popup-closed-by-user':   { field: 'form',     msg: 'Google sign-up was cancelled.' },
      'auth/network-request-failed': { field: 'form',     msg: 'Network error. Please check your connection.' },
    };
    return map[code] ?? { field: 'form', msg: 'Registration failed. Please try again.' };
  };

  // Returns a FieldErrors map (empty = all valid)
  const validate = (): FieldErrors => {
    const errs: FieldErrors = {};
    if (!form.name.trim())         errs.name  = 'Full name is required.';
    if (!form.email.includes('@')) errs.email = 'Please enter a valid email address.';
    const digitsOnly = form.phone.replace(/\D/g, '');
    if (!digitsOnly)               errs.phone = 'Phone number is required.';
    else if (digitsOnly.length !== selectedCountry.digits)
      errs.phone = `Enter a valid ${selectedCountry.digits}-digit number for ${form.countryCode}.`;
    if (form.password.length < 6)  errs.password = 'Password must be at least 6 characters.';
    if (form.password !== form.confirmPassword)
      errs.confirmPassword = 'Passwords do not match.';
    if (!form.vehiclePlate.trim()) errs.vehiclePlate = 'Vehicle plate is required.';
    else if (!plateValid)          errs.vehiclePlate = 'Please enter a valid Sri Lankan vehicle plate number.';
    if (!agreed)                   errs.terms = 'Please agree to the terms to continue.';
    return errs;
  };

  const saveUserProfile = (uid: string) => {
    const profile = {
      uid,
      name: form.name,
      email: form.email,
      phone: `${form.countryCode}${form.phone.replace(/\D/g, '')}`,
      vehiclePlate: form.vehiclePlate.trim().toUpperCase(),
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem(`at_profile_${uid}`, JSON.stringify(profile));
  };

  // ── Writes the registration plate as a vehicle doc in Firestore ──────────
  const saveVehicleToFirestore = async (uid: string) => {
    const plate = form.vehiclePlate.trim().toUpperCase();
    if (!plate) return;
    await addDoc(collection(db, 'users', uid, 'vehicles'), {
      plate,
      make:            '',
      model:           '',
      year:            '',
      tyreSize:        '',
      insuranceExpiry: '',
      revenueExpiry:   '',
      createdAt:       serverTimestamp(),
    });
  };

  const sendSmsNotification = async (to: string, name: string) => {
    try {
      await fetch(
        'https://us-central1-YOUR_PROJECT_ID.cloudfunctions.net/sendRegistrationSms',
        { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ to, name }) }
      );
    } catch { console.warn('SMS notification failed (non-critical)'); }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setFieldErrors(errs); return; }

    setIsLoading(true);
    setFieldErrors({});
    try {
      const cred = await createUserWithEmailAndPassword(auth, form.email, form.password);
      await updateProfile(cred.user, { displayName: form.name });
      saveUserProfile(cred.user.uid);
      await saveVehicleToFirestore(cred.user.uid);
      await sendEmailVerification(cred.user, { url: `${window.location.origin}/login`, handleCodeInApp: false });
      const fullPhone = `${form.countryCode}${form.phone.replace(/\D/g, '')}`;
      await sendSmsNotification(fullPhone, form.name);
      // Sign out immediately — user must verify email before they can log in
      await auth.signOut();
      setRegisteredName(form.name);
      setRegistered(true);
    } catch (err: any) {
      const { field, msg } = getFriendlyFirebaseError(err.code);
      setFieldErrors({ [field]: msg });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setGoogleLoading(true);
    setFieldErrors({});
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      const profile = { uid: cred.user.uid, name: cred.user.displayName || '', email: cred.user.email || '', phone: '', vehiclePlate: '', createdAt: new Date().toISOString() };
      localStorage.setItem(`at_profile_${cred.user.uid}`, JSON.stringify(profile));
      navigate('/dashboard');
    } catch (err: any) {
      const { field, msg } = getFriendlyFirebaseError(err.code);
      setFieldErrors({ [field]: msg });
    } finally {
      setGoogleLoading(false);
    }
  };

  const handlePlateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    clearErr('vehiclePlate');
    const raw = e.target.value;
    if (/ශ/.test(raw)) { setForm({ ...form, vehiclePlate: raw }); return; }
    const { formatted } = formatPlate(raw);
    setForm({ ...form, vehiclePlate: formatted });
  };

  const PLATE_FORMATS = [
    { label: 'Modern 3-Letter', example: 'WP CBA-1234', maxLength: 11 },
    { label: 'Modern 2-Letter', example: 'WP GA-1234',  maxLength: 10 },
    { label: 'Historical Dash', example: '19-1234',     maxLength:  7 },
    { label: 'Sri Series',      example: '15 ශ්‍රී 1234',  maxLength:  9 },
  ];


// ── Resend button used on the success screen (user is signed out at this point,
//    so we can't call sendEmailVerification directly — we re-sign in briefly) ──
function ResendVerificationButton({ email, password }: { email: string; password: string }) {
  const [state, setState] = React.useState<'idle' | 'sending' | 'sent'>('idle');
  const handleResend = async () => {
    setState('sending');
    try {
      const { signInWithEmailAndPassword: signIn } = await import('firebase/auth');
      const cred = await signIn(auth, email, password);
      await sendEmailVerification(cred.user, { url: `${window.location.origin}/login`, handleCodeInApp: false });
      await auth.signOut();
      setState('sent');
    } catch {
      setState('idle');
    }
  };
  if (state === 'sent') return <span className="text-green-400">Sent! Check your inbox.</span>;
  return (
    <button type="button" onClick={handleResend} disabled={state === 'sending'} className="text-brand-yellow hover:underline disabled:opacity-50">
      {state === 'sending' ? 'Sending…' : 'Resend verification email'}
    </button>
  );
}

// ── Success / verify-gate screen ──────────────────────────────────────────────
//    Shown after registration. User is signed OUT. They MUST verify before login.

  if (registered) {
    const fullPhone = `${form.countryCode}${form.phone.replace(/\D/g, '')}`;
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-white px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="w-full max-w-md text-center"
        >
          {/* Envelope pulsing — not logged in yet, must verify */}
          <div className="relative mx-auto mb-8 w-24 h-24">
            <div className="absolute inset-0 rounded-full bg-brand-yellow/10 animate-ping" />
            <div className="relative w-24 h-24 rounded-full bg-brand-yellow/10 border border-brand-yellow/30 flex items-center justify-center">
              <Mail className="w-10 h-10 text-brand-yellow" />
            </div>
          </div>

          <div className="w-8 h-1 bg-brand-yellow rounded mx-auto mb-5" />
          <h2 className="text-3xl font-black tracking-tight mb-2">
            One last step, {registeredName.split(' ')[0]}!
          </h2>
          <p className="text-neutral-400 text-sm mb-2">
            Your account is ready — but you need to{' '}
            <span className="text-white font-semibold">verify your email</span>{' '}
            before you can sign in.
          </p>
          <p className="text-neutral-600 text-xs mb-7">
            You won't be able to access the dashboard until verification is complete.
          </p>

          {/* 3-step progress */}
          <div className="flex items-center justify-between mb-7 text-xs">
            <div className="flex flex-col items-center gap-1.5">
              <div className="w-7 h-7 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center">
                <CheckCircle className="w-3.5 h-3.5 text-green-400" />
              </div>
              <span className="text-green-400 font-medium">Account created</span>
            </div>
            <div className="flex-1 h-px bg-white/10 mx-2 mt-[-12px]" />
            <div className="flex flex-col items-center gap-1.5">
              <div className="w-7 h-7 rounded-full bg-brand-yellow/20 border-2 border-brand-yellow flex items-center justify-center">
                <span className="text-brand-yellow font-black text-[10px]">2</span>
              </div>
              <span className="text-brand-yellow font-semibold">Verify email</span>
            </div>
            <div className="flex-1 h-px bg-white/10 mx-2 mt-[-12px]" />
            <div className="flex flex-col items-center gap-1.5">
              <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                <span className="text-neutral-600 font-black text-[10px]">3</span>
              </div>
              <span className="text-neutral-600">Sign in</span>
            </div>
          </div>

          {/* Email card — highlighted as action required */}
          <div className="flex items-start gap-4 bg-neutral-900 border border-brand-yellow/25 rounded-xl px-4 py-4 mb-3 text-left">
            <div className="w-9 h-9 rounded-lg bg-brand-yellow/10 border border-brand-yellow/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Mail className="w-4 h-4 text-brand-yellow" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-sm font-semibold text-white">Verification email sent</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-brand-yellow/15 text-brand-yellow border border-brand-yellow/25 font-medium">Action required</span>
              </div>
              <p className="text-xs text-neutral-500 truncate">{form.email}</p>
              <p className="text-xs text-neutral-600 mt-1">
                Open the email and click <span className="text-neutral-400">"Verify my email"</span> — then come back to sign in.
              </p>
            </div>
          </div>

          

          {/* Redirect to login — NOT dashboard */}
          <button
            onClick={() => navigate('/login')}
            className="w-full bg-brand-yellow text-black font-black py-4 rounded-xl hover:bg-yellow-300 active:scale-[0.98] transition-all shadow-[0_8px_30px_rgba(255,215,0,0.2)]"
          >
            I've verified — Go to Sign In →
          </button>

          <p className="text-xs text-neutral-600 mt-4">
            Didn't receive the email?{' '}
            <ResendVerificationButton email={form.email} password={form.password} />
          </p>
        </motion.div>
      </div>
    );
  }


  return (
    <div className="min-h-screen flex bg-neutral-950 text-white overflow-hidden">

      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden flex-col items-center justify-center p-16 bg-black">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `repeating-linear-gradient(-45deg, #FFD700 0px, #FFD700 1px, transparent 0px, transparent 40%)`, backgroundSize: '24px 24px' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-brand-red/5 blur-[120px]" />
        <div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-brand-yellow to-transparent" />
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="relative z-10 text-center max-w-sm">
          <Link to="/" className="flex-shrink-0 flex items-center gap-3">
            <img src={logo} alt="Anura Tyres Logo" className="h-12 w-auto object-contain" />
            <div className="flex flex-col leading-none">
              <span className="text-brand-white font-bold text-lg">ANURA TYRES</span>
              <span className="text-brand-gray text-xs tracking-wider">(Pvt) Ltd</span>
            </div>
          </Link>
          <div className="space-y-3 text-left mt-6">
            {[
              { icon: '📅', text: 'Book services online 24/7' },
              { icon: '🚗', text: 'Track all your vehicles in one place' },
              { icon: '🏷️', text: 'Access exclusive discounts & offers' },
              { icon: '📋', text: 'View service history & invoices' },
              { icon: '🔔', text: 'Insurance & revenue expiry reminders' },
            ].map(b => (
              <div key={b.text} className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3 border border-white/5">
                <span className="text-lg">{b.icon}</span>
                <span className="text-sm text-neutral-300">{b.text}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right form panel */}
      <div className="w-full lg:w-[55%] flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-12 overflow-y-auto relative">
        <Link to="/login" className="absolute top-6 left-6 flex items-center gap-2 text-sm text-neutral-500 hover:text-brand-yellow transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Login
        </Link>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-[400px] mx-auto"
        >
          <div className="mb-7">
            <div className="w-8 h-1 bg-brand-yellow rounded mb-4" />
            <h2 className="text-3xl font-black text-white tracking-tight">Create account</h2>
            <p className="text-neutral-500 mt-1 text-sm">Free forever. No credit card required.</p>
          </div>

          {/* Top-level form error (Firebase errors that don't map to a field) */}
          <AnimatePresence>
            {fieldErrors.form && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-5 flex items-start gap-3 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-sm overflow-hidden"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{fieldErrors.form}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Google */}
          <button
            onClick={handleGoogleRegister}
            disabled={isLoading || googleLoading}
            className="w-full flex items-center justify-center gap-3 bg-white text-neutral-900 font-bold py-3.5 rounded-xl hover:bg-neutral-100 active:scale-[0.98] transition-all mb-5 disabled:opacity-60 shadow-sm"
          >
            {googleLoading ? (
              <span className="w-5 h-5 border-2 border-neutral-300 border-t-neutral-700 rounded-full animate-spin" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            )}
            Sign up with Google
          </button>

          <div className="relative flex items-center mb-5">
            <div className="flex-1 h-px bg-white/10" />
            <span className="mx-4 text-xs text-neutral-600 uppercase tracking-widest">or fill in details</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <form onSubmit={handleRegister} className="space-y-4" autoComplete="off">

            {/* ── Full Name ── */}
            <div>
              <label className="block text-xs font-semibold text-neutral-400 mb-1.5 uppercase tracking-wider">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
                <input
                  type="text"
                  value={form.name}
                  onChange={e => { clearErr('name'); setForm({ ...form, name: e.target.value.toUpperCase() }); }}
                  placeholder="JOHN DOE"
                  autoComplete="off"
                  style={{ textTransform: 'uppercase' }}
                  className={`w-full bg-neutral-900 border rounded-xl pl-11 pr-4 py-3.5 text-white text-sm placeholder-neutral-700 focus:outline-none focus:ring-1 transition-all
                    ${fieldErrors.name ? 'border-red-500/60 focus:border-red-400 focus:ring-red-400/20' : 'border-white/10 focus:border-brand-yellow focus:ring-brand-yellow/30'}`}
                />
              </div>
              <FieldError message={fieldErrors.name} />
            </div>

            {/* ── Email ── */}
            <div>
              <label className="block text-xs font-semibold text-neutral-400 mb-1.5 uppercase tracking-wider">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
                <input
                  type="email"
                  value={form.email}
                  onChange={e => { clearErr('email'); setForm({ ...form, email: e.target.value }); }}
                  placeholder="you@example.com"
                  autoComplete="off"
                  className={`w-full bg-neutral-900 border rounded-xl pl-11 pr-4 py-3.5 text-white text-sm placeholder-neutral-700 focus:outline-none focus:ring-1 transition-all
                    ${fieldErrors.email ? 'border-red-500/60 focus:border-red-400 focus:ring-red-400/20' : 'border-white/10 focus:border-brand-yellow focus:ring-brand-yellow/30'}`}
                />
              </div>
              <FieldError message={fieldErrors.email} />
            </div>

            {/* ── Phone ── */}
            <div>
              <label className="block text-xs font-semibold text-neutral-400 mb-1.5 uppercase tracking-wider">Phone Number</label>
              <div className="flex gap-2">
                {/* Country code selector */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowCountryDrop(!showCountryDrop)}
                    className={`h-full flex items-center gap-1.5 bg-neutral-900 border rounded-xl px-3 py-3.5 text-white text-sm hover:border-brand-yellow/50 focus:outline-none focus:border-brand-yellow transition-all whitespace-nowrap
                      ${fieldErrors.phone ? 'border-red-500/60' : 'border-white/10'}`}
                  >
                    <span>{selectedCountry.flag}</span>
                    <span className="font-mono text-neutral-300">{form.countryCode}</span>
                    <svg className={`w-3 h-3 text-neutral-600 transition-transform ${showCountryDrop ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </button>
                  {showCountryDrop && (
                    <div className="absolute top-full left-0 mt-1 z-50 bg-neutral-900 border border-white/10 rounded-xl overflow-hidden shadow-xl min-w-[160px] max-h-60 overflow-y-auto">
                      {COUNTRY_CODES.map(c => (
                        <button
                          key={c.code + c.name}
                          type="button"
                          onClick={() => { setForm({ ...form, countryCode: c.code, phone: '' }); setShowCountryDrop(false); clearErr('phone'); }}
                          className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm hover:bg-white/5 transition-colors text-left ${form.countryCode === c.code ? 'text-brand-yellow' : 'text-neutral-300'}`}
                        >
                          <span>{c.flag}</span>
                          <span className="font-mono">{c.code}</span>
                          <span className="text-neutral-600 text-xs truncate">{c.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {/* Number input */}
                <div className="relative flex-1">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
                  <input
                    type="tel"
                    inputMode="numeric"
                    value={form.phone}
                    onChange={e => {
                      clearErr('phone');
                      const digits = e.target.value.replace(/\D/g, '').slice(0, selectedCountry.digits);
                      setForm({ ...form, phone: digits });
                    }}
                    placeholder={'0'.repeat(selectedCountry.digits)}
                    maxLength={selectedCountry.digits}
                    autoComplete="off"
                    className={`w-full bg-neutral-900 border rounded-xl pl-11 pr-10 py-3.5 text-white text-sm font-mono placeholder-neutral-700 focus:outline-none focus:ring-1 transition-all
                      ${fieldErrors.phone
                        ? 'border-red-500/60 focus:border-red-400 focus:ring-red-400/20'
                        : form.phone
                          ? phoneValid
                            ? 'border-green-500/50 focus:border-green-400 focus:ring-green-400/20'
                            : 'border-white/10 focus:border-brand-yellow focus:ring-brand-yellow/30'
                          : 'border-white/10 focus:border-brand-yellow focus:ring-brand-yellow/30'
                      }`}
                  />
                  {form.phone && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      {phoneValid
                        ? <CheckCircle className="w-4 h-4 text-green-400" />
                        : <span className="text-[10px] font-mono text-neutral-600">{phoneDigits.length}/{selectedCountry.digits}</span>
                      }
                    </div>
                  )}
                </div>
              </div>
              <FieldError message={fieldErrors.phone} />
            </div>

            {/* ── Password ── */}
            <div>
              <label className="block text-xs font-semibold text-neutral-400 mb-1.5 uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => { clearErr('password'); setForm({ ...form, password: e.target.value }); }}
                  placeholder="Min. 6 characters"
                  style={{ textTransform: 'none' }}
                  autoComplete="new-password"
                  className={`w-full bg-neutral-900 border rounded-xl pl-11 pr-12 py-3.5 text-white text-sm placeholder-neutral-700 focus:outline-none focus:ring-1 transition-all
                    ${fieldErrors.password ? 'border-red-500/60 focus:border-red-400 focus:ring-red-400/20' : 'border-white/10 focus:border-brand-yellow focus:ring-brand-yellow/30'}`}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-white transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {form.password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1,2,3,4].map(i => (
                      <div key={i} className={`flex-1 h-1 rounded-full transition-all ${i <= pwdScore ? strengthColor[pwdScore] : 'bg-white/10'}`} />
                    ))}
                  </div>
                  <p className={`text-xs ${pwdScore <= 1 ? 'text-red-400' : pwdScore <= 2 ? 'text-orange-400' : pwdScore <= 3 ? 'text-yellow-400' : 'text-green-400'}`}>
                    {strengthLabel[pwdScore]}
                  </p>
                </div>
              )}
              <FieldError message={fieldErrors.password} />
            </div>

            {/* ── Confirm Password ── */}
            <div>
              <label className="block text-xs font-semibold text-neutral-400 mb-1.5 uppercase tracking-wider">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
                <input
                  type="password"
                  value={form.confirmPassword}
                  onChange={e => { clearErr('confirmPassword'); setForm({ ...form, confirmPassword: e.target.value }); }}
                  placeholder="Repeat your password"
                  style={{ textTransform: 'none' }}
                  autoComplete="new-password"
                  className={`w-full bg-neutral-900 border rounded-xl pl-11 pr-10 py-3.5 text-white text-sm placeholder-neutral-700 focus:outline-none focus:ring-1 transition-all
                    ${fieldErrors.confirmPassword
                      ? 'border-red-500/60 focus:border-red-400 focus:ring-red-400/20'
                      : form.confirmPassword
                        ? form.password === form.confirmPassword
                          ? 'border-green-500/50 focus:border-green-400 focus:ring-green-400/20'
                          : 'border-white/10 focus:border-brand-yellow focus:ring-brand-yellow/30'
                        : 'border-white/10 focus:border-brand-yellow focus:ring-brand-yellow/30'
                    }`}
                />
                {form.confirmPassword && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    {form.password === form.confirmPassword
                      ? <CheckCircle className="w-4 h-4 text-green-400" />
                      : <AlertCircle className="w-4 h-4 text-red-400" />
                    }
                  </div>
                )}
              </div>
              <FieldError message={fieldErrors.confirmPassword} />
            </div>

            {/* ── Vehicle Plate ── */}
            <div>
              <label className="block text-xs font-semibold text-neutral-400 mb-1.5 uppercase tracking-wider">Vehicle Plate</label>
              <div className="relative">
                <Car className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
                <input
                  type="text"
                  inputMode={/^\d/.test(form.vehiclePlate) && !/ශ/.test(form.vehiclePlate) ? 'numeric' : 'text'}
                  value={form.vehiclePlate}
                  onChange={handlePlateChange}
                  placeholder="e.g. WP CBA-1234"
                  maxLength={plateMaxLength}
                  autoComplete="off"
                  className={`w-full bg-neutral-900 border rounded-xl pl-11 pr-10 py-3.5 text-white text-sm font-mono placeholder-neutral-700 focus:outline-none focus:ring-1 transition-all uppercase
                    ${fieldErrors.vehiclePlate
                      ? 'border-red-500/60 focus:border-red-400 focus:ring-red-400/20'
                      : form.vehiclePlate
                        ? plateValid
                          ? 'border-green-500/50 focus:border-green-400 focus:ring-green-400/20'
                          : 'border-red-500/50 focus:border-red-400 focus:ring-red-400/20'
                        : 'border-white/10 focus:border-brand-yellow focus:ring-brand-yellow/30'
                    }`}
                  style={{ textTransform: /ශ/.test(form.vehiclePlate) ? 'none' : 'uppercase' }}
                />
                {form.vehiclePlate && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    {plateValid ? <CheckCircle className="w-4 h-4 text-green-400" /> : <AlertCircle className="w-4 h-4 text-red-400" />}
                  </div>
                )}
              </div>
              {/* Format reference */}
              <div className="mt-2.5 grid grid-cols-2 gap-1">
                {PLATE_FORMATS.map(fmt => (
                  <button
                    key={fmt.example}
                    type="button"
                    onClick={() => { setForm({ ...form, vehiclePlate: fmt.example }); clearErr('vehiclePlate'); }}
                    className={`text-left px-2.5 py-1.5 rounded-lg border transition-all group
                      ${form.vehiclePlate === fmt.example ? 'border-brand-yellow/60 bg-brand-yellow/5' : 'border-white/8 hover:border-white/20 bg-white/[0.02]'}`}
                  >
                    <span className="block text-[9px] text-neutral-600 group-hover:text-neutral-500 uppercase tracking-wider mb-0.5">{fmt.label}</span>
                    <span className="block text-[11px] font-mono text-neutral-400 group-hover:text-neutral-300">{fmt.example}</span>
                  </button>
                ))}
              </div>
              <FieldError message={fieldErrors.vehiclePlate} />
            </div>

            {/* ── Terms ── */}
            <div>
              <label className="flex items-start gap-3 cursor-pointer group">
                <div
                  onClick={() => { setAgreed(!agreed); clearErr('terms'); }}
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all cursor-pointer
                    ${fieldErrors.terms
                      ? agreed ? 'bg-brand-yellow border-brand-yellow' : 'border-red-500/70 bg-red-500/5'
                      : agreed ? 'bg-brand-yellow border-brand-yellow' : 'border-white/20 group-hover:border-white/40'
                    }`}
                >
                  {agreed && <span className="text-black text-xs font-black">✓</span>}
                </div>
                <span className="text-xs text-neutral-500 leading-relaxed">
                  I agree to the{' '}
                  <a href="#" className="text-brand-yellow hover:underline">Terms of Service</a>
                  {' '}and{' '}
                  <a href="#" className="text-brand-yellow hover:underline">Privacy Policy</a>
                </span>
              </label>
              <FieldError message={fieldErrors.terms} />
            </div>

            <button
              type="submit"
              disabled={isLoading || googleLoading}
              className="w-full bg-brand-yellow text-black font-black py-4 rounded-xl hover:bg-yellow-300 active:scale-[0.98] transition-all shadow-[0_8px_30px_rgba(255,215,0,0.2)] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center mt-1"
            >
              {isLoading ? <span className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" /> : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-neutral-600 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-brand-yellow hover:text-yellow-300 transition-colors">Sign in →</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}