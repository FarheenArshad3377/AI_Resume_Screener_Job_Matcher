using UglyToad.PdfPig;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Wordprocessing;
using System.Text;

namespace ResumeScreener.Api.Services
{
    public class ResumeParserService : IResumeParserService
    {
        public async Task<string> ExtractTextAsync(string filePath)
        {
            var extension = Path.GetExtension(filePath).ToLowerInvariant();

            return extension switch
            {
                ".pdf" => await Task.Run(() => ExtractFromPdf(filePath)),
                ".docx" => await Task.Run(() => ExtractFromDocx(filePath)),
                _ => throw new NotSupportedException($"File type '{extension}' is not supported. Only PDF and DOCX are allowed.")
            };
        }

        private string ExtractFromPdf(string filePath)
        {
            var text = new StringBuilder();

            using (var document = PdfDocument.Open(filePath))
            {
                foreach (var page in document.GetPages())
                {
                    text.AppendLine(page.Text);
                }
            }

            return text.ToString();
        }

        private string ExtractFromDocx(string filePath)
        {
            var text = new StringBuilder();

            using (var wordDoc = WordprocessingDocument.Open(filePath, false))
            {
                var body = wordDoc.MainDocumentPart?.Document?.Body;
                if (body != null)
                {
                    foreach (var paragraph in body.Elements<Paragraph>())
                    {
                        text.AppendLine(paragraph.InnerText);
                    }
                }
            }

            return text.ToString();
        }
    }
}