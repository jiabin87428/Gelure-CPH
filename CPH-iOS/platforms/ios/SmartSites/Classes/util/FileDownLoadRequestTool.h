//
//  FileDownLoadRequestTool.h
//  sck-ios
//
//  Created by 李家斌 on 16/5/18.
//  Copyright © 2016年 gelure. All rights reserved.
//

#import <Foundation/Foundation.h>

typedef void(^downLoadCompleteBlock)(int);//0失败，1成功

@interface FileDownLoadRequestTool : NSObject<NSURLConnectionDataDelegate>

//返回数据
@property NSMutableData *fileData;

//文件的总长度
@property (nonatomic, assign) long long totalLength;

//当前已经写入的总大小
@property (nonatomic, assign) long long  currentLength;

//文件名
@property(nonatomic,copy)NSString *fileName;

//用来写数据的文件句柄对象
@property (nonatomic, strong) NSFileHandle *writeHandle;

- (instancetype)initWithBlock:(downLoadCompleteBlock)block;

//发送请求
-(void)downWithUrl:(NSURL *)url withFileName:(NSString *)fileNamed;

@end
