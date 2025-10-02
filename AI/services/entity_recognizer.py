import re

class EntityRecognizer:
    """Entity recognition for extracting truong, nganh, year from questions"""
    
    def __init__(self):
        # Common university keywords
        self.university_patterns = [
            r'(đại học|trường|học viện|ĐH|DH)\s+([A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ\s]+)',
            r'bách khoa',
            r'kinh tế',
            r'ngoại thương',
            r'y\s+hà\s+nội',
            r'quốc gia',
            r'khoa học tự nhiên',
        ]
        
        # Common major keywords
        self.major_patterns = [
            r'ngành\s+([A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ\s]+)',
            r'(công nghệ thông tin|CNTT)',
            r'(kỹ thuật|y khoa|luật|kinh tế|quản trị|kế toán|marketing)',
            r'(điện|cơ khí|xây dựng|hóa|sinh|toán)',
        ]
        
        # Year patterns
        self.year_patterns = [
            r'năm\s+(\d{4})',
            r'(\d{4})',
            r'(202[0-9])',
        ]
    
    def extract(self, question):
        """Extract entities from question"""
        entities = {
            'truong': [],
            'nganh': [],
            'nam': None
        }
        
        # Extract university names
        for pattern in self.university_patterns:
            matches = re.finditer(pattern, question, re.IGNORECASE)
            for match in matches:
                if match.lastindex and match.lastindex >= 1:
                    university = match.group(match.lastindex).strip()
                else:
                    university = match.group(0).strip()
                if university and university not in entities['truong']:
                    entities['truong'].append(university)
        
        # Extract major names
        for pattern in self.major_patterns:
            matches = re.finditer(pattern, question, re.IGNORECASE)
            for match in matches:
                if match.lastindex and match.lastindex >= 1:
                    major = match.group(match.lastindex).strip()
                else:
                    major = match.group(0).strip()
                if major and major not in entities['nganh']:
                    entities['nganh'].append(major)
        
        # Extract year
        for pattern in self.year_patterns:
            matches = re.finditer(pattern, question)
            for match in matches:
                year_str = match.group(1) if match.lastindex >= 1 else match.group(0)
                try:
                    year = int(year_str)
                    if 2020 <= year <= 2030:  # Valid year range
                        entities['nam'] = year
                        break
                except:
                    pass
        
        return entities
    
    def has_entities(self, entities):
        """Check if any entities were found"""
        return bool(entities['truong'] or entities['nganh'] or entities['nam'])

