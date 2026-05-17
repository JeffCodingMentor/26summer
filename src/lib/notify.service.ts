export async function sendCENotify(message: string) {
  const token = process.env.CE_NOTIFY_TOKEN || 'bn6PqK5qffcvjsGWbxczUDS6CvVFY43a';
  
  try {
    const response = await fetch('https://v2.chateverywhere.app/api/line/notify', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        markdown: true,
      }),
    });
    
    if (!response.ok) {
      console.error('CE Notify failed:', await response.text());
    }
  } catch (error) {
    console.error('CE Notify error:', error);
  }
}
