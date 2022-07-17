export interface OtpRequestDto {
  api_key: string;
  message_type: string;
  to: string;
  from: string;
  channel: string;
  pin_attempts: number;
  pin_time_to_live: number;
  pin_length: number;
  pin_placeholder: string;
  message_text: string;
  pin_type: string;
}
